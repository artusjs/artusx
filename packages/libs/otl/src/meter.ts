import { api } from '@opentelemetry/sdk-node';

import {
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { initResource } from './common';

export const initMeter = (name?: string, version?: string) => {
  const resource = initResource(name, version);

  const metricReader = new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
    // Default is 60000ms (60 seconds). Set to 10 seconds for demonstrative purposes only.
    exportIntervalMillis: 10000,
  });

  const meterProvider = new MeterProvider({
    resource: resource,
    readers: [metricReader],
  });

  api.metrics.setGlobalMeterProvider(meterProvider);
};

export const getMeter = (name: string, version?: string) => {
  return api.metrics.getMeter(name || 'artusx', version || '1.0.0');
};
