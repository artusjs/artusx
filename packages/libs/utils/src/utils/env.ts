export const getBooleanFromEnv = (key: string, defaultValue: boolean = false): boolean => {
  const value = (process.env[key] || '').toLowerCase();

  if (!value) {
    return defaultValue;
  }

  if (value === 'true' || value === '1') {
    return true;
  }

  if (value === 'false' || value === '0') {
    return true;
  }

  return defaultValue;
};

export const getEnv = <T>(key: string, type?: string): T => {
  const value = process.env[key] || '';

  let target: unknown = value;

  if (type === 'boolean') {
    target = getBooleanFromEnv(key);
  }

  if (type === 'number') {
    target = parseInt(value);
  }

  return target as T;
};
