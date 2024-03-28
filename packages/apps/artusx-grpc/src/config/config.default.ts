import path from 'path';
import type { ArtusxGrpcConfig } from '@artusx/plugin-grpc';

export default () => {
  const grpc: ArtusxGrpcConfig = {
    client: {
      addr: '0.0.0.0:50051',
    },

    server: {
      addr: '0.0.0.0:50051',
    },

    static: {
      proto: path.resolve(__dirname, '../proto'),
      codegen: path.resolve(__dirname, '../proto-codegen'),
    },

    dynamic: {
      proto: [path.resolve(__dirname, '../echo-module/proto/echo.proto')],
    },
  };

  return {
    grpc,
  };
};
