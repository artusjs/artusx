import path from 'path';
import { ArtusXConfig, NunjucksConfigureOptions } from '@artusx/core';
import type { SocketIOServerConfig } from '@artusx/plugin-socketio';

export default () => {
  const artusx: ArtusXConfig = {
    port: 7001,
    static: {
      prefix: '/public/',
      dir: path.resolve(__dirname, '../public'),
    },
  };

  const nunjucks: NunjucksConfigureOptions = {
    path: path.resolve(__dirname, '../view'),
    options: {
      autoescape: true,
      noCache: true,
    },
  };

  const socketio: SocketIOServerConfig = {
    path: '/socket.io',
  };

  return {
    artusx,
    nunjucks,
    socketio,
  };
};
