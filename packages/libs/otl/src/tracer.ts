import { api } from '@opentelemetry/sdk-node';

import { BasicTracerProvider, BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { initResource } from './common';

export const initTracer = (name?: string, version?: string) => {
  const resource = initResource(name, version);

  const provider = new BasicTracerProvider({
    resource,
    spanProcessors: [new BatchSpanProcessor(new ConsoleSpanExporter())],
  });

  api.trace.setGlobalTracerProvider(provider);
};

export const getTracer = (name: string, version?: string) => {
  return api.trace.getTracer(name || 'artusx', version || '1.0.0');
};

export const getTraceId = () => {
  const currentSpan = api.trace.getSpan(api.context.active());
  if (!currentSpan) {
    return '';
  }

  // console.log(currentSpan.spanContext());
  return currentSpan.spanContext().traceId;
};

export const addEvent = (event: string, data: { key: string; value: any }) => {
  const currentSpan = api.trace.getSpan(api.context.active());
  currentSpan?.addEvent(event);
  currentSpan?.setAttribute(data.key, data.value);
};
