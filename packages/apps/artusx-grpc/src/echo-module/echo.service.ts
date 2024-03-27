import * as grpc from '@grpc/grpc-js';
import { GrpcService, GrpcMethod } from '@artusx/plugin-grpc';

interface EchoRequest {
  message: string;
}

interface EchoResponse {
  message: string;
}

@GrpcService({
  packageName: 'grpc.examples.echo',
  serviceName: 'Echo',
})
export default class EchoService {
  @GrpcMethod({
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
