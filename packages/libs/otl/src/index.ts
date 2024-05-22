import * as api from '@opentelemetry/api';
import { KoaInstrumentation } from '@opentelemetry/instrumentation-koa';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const EXPORTER = process.env.EXPORTER || '';

export const getTraceId = () => {
  const currentSpan = api.trace.getSpan(api.context.active());
  if (!currentSpan) {
    return '';
  }

  console.log(currentSpan.spanContext());

  return currentSpan.spanContext().traceId;
};

export const addEvent = (event: string, data: { key: string; value: any }) => {
  const currentSpan = api.trace.getSpan(api.context.active());
  currentSpan?.addEvent(event);
  currentSpan?.setAttribute(data.key, data.value);
};

export const setupTracing = (serviceName: string) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: serviceName,
    }),
  });

  let exporter;

  if (EXPORTER === 'jaeger') {
    exporter = new JaegerExporter();
  } else {
    exporter = new ZipkinExporter();
  }

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  registerInstrumentations({
    instrumentations: [new KoaInstrumentation(), new HttpInstrumentation()],
    tracerProvider: provider,
  });

  provider.register();

  return api.trace.getTracer(serviceName);
};
