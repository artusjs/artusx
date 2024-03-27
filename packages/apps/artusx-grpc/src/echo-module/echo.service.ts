import * as grpc from '@grpc/grpc-js';
import { GRPC, GRPCHandler } from '@artusx/plugin-grpc';

interface EchoRequest {
  message: string;
}

interface EchoResponse {
  message: string;
}

@GRPC({
  packageName: 'grpc.examples.echo',
  serviceName: 'Echo',
})
export default class EchoService {
  @GRPCHandler({
    enable: true,
  })
  UnaryEcho(
    call: grpc.ServerUnaryCall<EchoRequest, EchoResponse>,
    callback: grpc.requestCallback<EchoResponse>
  ) {
    console.log('server:Echo:UnaryEcho', call.request);
    callback(null, {
      message: 'getMessage: ' + call.request.message,
    });
  }
}
