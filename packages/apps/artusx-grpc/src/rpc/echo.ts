import { GRPC, GRPCHandler } from '@artusx/plugin-grpc';

@GRPC({
  packageName: 'grpc.examples.echo',
  serviceName: 'Echo',
})
export default class EchoService {
  @GRPCHandler({
    enable: true,
  })
  UnaryEcho(call: any, callback: any) {
    console.log('server:Echo:UnaryEcho', call.request);
    callback(null, {
      message: 'Hello ' + call.request.name,
      from: 'handler 222',
    });
  }
}
