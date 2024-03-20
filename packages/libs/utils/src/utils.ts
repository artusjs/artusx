export const getEnv = <T>(key: string, type?: string): T => {
  const value = process.env[key] || '';

  let target: unknown = value;

  if (type === 'boolean') {
    target = Boolean(value);
  }

  if (type === 'number') {
    target = parseInt(value);
  }

  return target as T;
};

export const getApiId = () => {
  const apiID = getEnv<Number>('API_ID', 'number');

  if (!apiID) {
    return;
  }

  return apiID;
};

export const getProxy = () => {
  const ip = getEnv<string>('PROXY_IP');
  const port = getEnv<Number>('PROXY_PORT', 'number');
  const socksType = getEnv<Number>('PROXY_SOCKET_TYPE', 'number');

  if (!ip || !port || !socksType) {
    return;
  }

  const protocol = socksType === 5 ? 'socks5' : 'socks4';
  const proxyString = `${protocol}://${ip}:${port}`;

  return {
    ip,
    port,
    socksType,
    proxyString,
  };
};
