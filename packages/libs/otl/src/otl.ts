import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';

import { KoaInstrumentation } from '@opentelemetry/instrumentation-koa';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';

import { PeriodicExportingMetricReader, ConsoleMetricExporter } from '@opentelemetry/sdk-metrics';

import { initResource } from './common';

export const initOtl = (name?: string, version?: string) => {
  const sdk = new NodeSDK({
    resource: initResource(name, version),
    traceExporter: new ConsoleSpanExporter(),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new ConsoleMetricExporter(),
    }),
    instrumentations: [new KoaInstrumentation(), new HttpInstrumentation()],
  });

  sdk.start();
};
