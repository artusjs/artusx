import path from 'path';
import 'reflect-metadata';
import { ArtusApplication } from '@artus/core';

const main = async () => {
  const app = new ArtusApplication();

  await app.load({
    version: '2',
    refMap: {
      _app: {
        pluginConfig: {},
        items: [
          {
            path: path.resolve(__dirname, './service'),
            extname: '.ts',
            filename: 'service.ts',
            loader: 'module',
            source: 'app',
          },
        ],
      },
    },
  });

  await app.run();

  console.log('app is running', app);
  return app;
};

main();
