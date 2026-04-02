import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { resourceFromAttributes, defaultResource } from '@opentelemetry/resources';

export const initResource = (name?: string, version?: string) => {
  const resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: name || 'artusx',
    [ATTR_SERVICE_VERSION]: version || '1.0',
  });

  return defaultResource().merge(resource);
};
