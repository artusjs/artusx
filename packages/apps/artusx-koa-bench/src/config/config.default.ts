import path from 'path';

import { ArtusxConfig } from '@artusx/core';

export default () => {
  const artusx: ArtusxConfig = {
    port: 7001,
    middlewares: [],
    static: {
      prefix: '/public/',
      dir: path.resolve(__dirname, '../public'),
      dynamic: true,
      preload: false,
      buffer: false,
      maxFiles: 1000,
    },
  };

  return {
    // artusx
    artusx,
  };
};
