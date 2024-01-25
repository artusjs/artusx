import path from 'path';
import { Application } from '@artusx/utils';

export const main = async () => {
  const app = await Application.start({
    root: path.resolve(__dirname),
    configDir: 'config',
  });

  return app;
};
