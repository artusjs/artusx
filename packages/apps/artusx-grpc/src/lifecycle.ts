import assert from 'assert';
import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, ArtusInjectEnum } from '@artus/core';
import { GRPCClient, GRPCConfig } from '@artusx/plugin-grpc';
import { credentials } from '@artusx/plugin-grpc/types';
import { ArtusXInjectEnum } from '@artusx/utils';

@LifecycleHookUnit()
export default class CustomLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  @Inject(ArtusXInjectEnum.GRPC)
  grpcClient: GRPCClient;

  @LifecycleHook()
  async didReady() {}

  private async invoke() {
    const config: GRPCConfig = this.config.grpc;

    assert(config?.server, 'config.server is required');
    const { host, port } = config?.server;
    const serverUrl = `${host || 'localhost'}:${port}`;

    // greeter
    const GreeterService = this.grpcClient.getService('helloworld', 'Greeter');
    assert(GreeterService, 'GreeterService is required');
    const GreeterClient = new GreeterService(serverUrl, credentials.createInsecure());
    GreeterClient.sayHello({ name: 'you' }, function (_err: Error, response: any) {
      console.log('client:Greeting:sayHello', response);
    });

    // echo
    const EchoService = this.grpcClient.getService('grpc.examples.echo', 'Echo');
    assert(EchoService, 'Service is required');
    const echoClient = new EchoService(serverUrl, credentials.createInsecure());

    echoClient.UnaryEcho({ name: 'you' }, function (_err: Error, response: any) {
      console.log('client:Echo:UnaryEcho', response);
    });
  }

  @LifecycleHook()
  public async willReady() {
    await this.invoke();
  }
}
