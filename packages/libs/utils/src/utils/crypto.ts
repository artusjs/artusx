import * as crypto from 'crypto';

export const md5 = (signature: string) => {
  return crypto.createHash('md5').update(signature).digest('hex');
};

export const hmac = (password: string, salt: string) => {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
};

export const slat = () => {
  return crypto.randomBytes(16).toString('hex');
};
