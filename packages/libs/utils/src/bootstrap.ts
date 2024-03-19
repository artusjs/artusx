import path from 'path';
import dotenv from 'dotenv';
import { Application } from './application';

dotenv.config();

export const bootstrap = async (options?: object, configDir?: string) => {
  const app = await Application.start({
    ...options,
    root: path.resolve(__dirname),
    configDir: configDir || 'config',
  });

  return app;
};
