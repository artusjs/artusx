import path from 'path';
import dotenv from 'dotenv';
import { Application } from '@artusx/utils';

dotenv.config();

export const main = async (options?: object) => {
  const app = await Application.start({
    ...options,
    root: path.resolve(__dirname),
    configDir: 'config',
  });

  return app;
};
