import dotenv from 'dotenv';
import { Application } from './application';

dotenv.config();

export const bootstrap = async (options: Options) => {
  const { root, configDir = 'config', ...rest } = options || {};
  const app = await Application.start({
    ...rest,
    root,
    configDir,
  });

  return app;
};

export type Options = Record<string, any> & {
  root: string;
  configDir?: string;
};
