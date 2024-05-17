import { md5 } from './crypto';
import { getEnv } from './env';

export const avatar = (email: string) => {
  if (!email) {
    return '';
  }
  const hash = md5(email);
  return `https://s.gravatar.com/avatar/${hash}`;
};

export const getApiId = () => {
  const apiID = getEnv<number>('API_ID', 'number');

  if (!apiID) {
    return;
  }

  return apiID;
};

export const getProxy = () => {
  const ip = getEnv<string>('PROXY_IP');
  const port = getEnv<number>('PROXY_PORT', 'number');
  const socksType = getEnv<number>('PROXY_SOCKET_TYPE', 'number');

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
