import * as crypto from 'crypto';

// crypto
export const md5 = (signature: string) => {
  return crypto.createHash('md5').update(signature).digest('hex');
};

export const hmac = (password: string, salt: string) => {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
};

export const slat = () => {
  return crypto.randomBytes(16).toString('hex');
};

export const avatar = (email: string) => {
  if (!email) {
    return '';
  }
  const hash = md5(email);
  return `https://s.gravatar.com/avatar/${hash}`;
};

// env utils
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
