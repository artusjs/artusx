import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';

import { Resource } from '@opentelemetry/resources';

export const initResource = (name?: string, version?: string) => {
  const resource = new Resource({
    [SEMRESATTRS_SERVICE_NAME]: name || 'artusx',
    [SEMRESATTRS_SERVICE_VERSION]: version || '1.0',
  });

  return Resource.default().merge(resource);
};
