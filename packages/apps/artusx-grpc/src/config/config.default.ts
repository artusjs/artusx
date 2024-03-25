import path from 'path';

export default () => {
  const grpc = {
    protoList: [
      path.resolve(__dirname, '../protos/helloworld.proto'),
      path.resolve(__dirname, '../protos/echo.proto'),
    ],
    server: {
      host: '0.0.0.0',
      port: '50051',
    },
  };

  return {
    grpc,
  };
};
