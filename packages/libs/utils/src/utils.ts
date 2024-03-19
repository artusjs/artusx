export const getApiId = () => {
  const api_id = process.env.API_ID;

  if (!api_id) {
    return;
  }

  return parseInt(api_id);
};

export const getProxy = () => {
  const proxy_ip = process.env.PROXY_IP;
  const proxy_port = process.env.PROXY_PORT;
  const proxy_socket_type = process.env.PROXY_SOCKET_TYPE;

  if (!proxy_ip || !proxy_port || !proxy_socket_type) {
    return;
  }

  const proxy_protocol = proxy_socket_type === '5' ? 'socks5' : 'socks4';

  const proxyString = `${proxy_protocol}://${proxy_ip}:${proxy_port}`;

  return {
    ip: proxy_ip,
    port: parseInt(proxy_port),
    socksType: parseInt(proxy_socket_type),
    proxyString,
  };
};

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
