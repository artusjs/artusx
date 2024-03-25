import { GRPC, GRPCHandler } from '@artusx/plugin-grpc';

@GRPC({
  packageName: 'helloworld',
  serviceName: 'Greeter',
})
export default class GreeterService {
  @GRPCHandler({
    enable: true,
  })
  sayHello(call: any, callback: any) {
    console.log('server:Greeting:sayHello', call.request);
    callback(null, {
      message: 'Hello ' + call.request.name,
      from: 'handler 222',
    });
  }
}
