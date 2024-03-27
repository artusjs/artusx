import assert from 'assert';

import { Inject, ArtusInjectEnum } from '@artus/core';
import { ArtusXInjectEnum } from '@artusx/utils';

import { Schedule } from '@artusx/plugin-schedule';
import type { ArtusxSchedule } from '@artusx/plugin-schedule';

import { GRPCClient, GRPCConfig } from '@artusx/plugin-grpc';
import { credentials } from '@artusx/plugin-grpc/types';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusxSchedule {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  @Inject(ArtusXInjectEnum.GRPC)
  grpcClient: GRPCClient;

  private async invokeDynamic() {
    const config: GRPCConfig = this.config.grpc;

    assert(config?.server, 'config.server is required');
    const { host, port } = config?.server;
    const serverUrl = `${host || 'localhost'}:${port}`;

    const EchoService = this.grpcClient.getService('grpc.examples.echo', 'Echo');
    assert(EchoService, 'Service is required');
    const echoClient = new EchoService(serverUrl, credentials.createInsecure());

    echoClient.UnaryEcho({ message: 'ping' }, function (_err: Error, response: any) {
      console.log('client:Echo:UnaryEcho', response);
    });
  }

  async run() {
    // if(process.env.xxx) {

    // }

    await this.invokeDynamic();
  }
}
