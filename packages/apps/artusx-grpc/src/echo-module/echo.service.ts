import { GRPC, GRPCHandler } from '@artusx/plugin-grpc';

type GRPCRequest<T> = {
  request: T;
};

type GRPCCallback<T> = (err: Error | null, data: T) => void;

@GRPC({
  packageName: 'grpc.examples.echo',
  serviceName: 'Echo',
})
export default class EchoService {
  @GRPCHandler({
    enable: true,
  })
  UnaryEcho(call: GRPCRequest<{ message: string }>, callback: GRPCCallback<{ message: string }>) {
    console.log('server:Echo:UnaryEcho', call.request);
    callback(null, {
      message: 'getMessage: ' + call.request.message,
    });
  }
}
