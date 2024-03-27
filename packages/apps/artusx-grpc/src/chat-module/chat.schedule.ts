import assert from 'assert';
import * as grpc from '@grpc/grpc-js';

import { Inject, ArtusInjectEnum } from '@artus/core';
import { Schedule } from '@artusx/plugin-schedule';
import type { ArtusxSchedule } from '@artusx/plugin-schedule';

import { GRPCConfig } from '@artusx/plugin-grpc';
import { ChatClient, ClientMessage } from '../proto-codegen/chat';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusxSchedule {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  private async invokeStatic() {
    const config: GRPCConfig = this.config.grpc;

    assert(config?.server, 'config.server is required');
    const { host, port } = config?.server;
    const serverUrl = `${host || 'localhost'}:${port}`;

    const chatClient = new ChatClient(serverUrl, grpc.credentials.createInsecure());
    const message = new ClientMessage({
      user: '@client',
      text: 'hello',
    });

    try {
      const response = await chatClient.join(message);
      console.log('response', response.toObject());
    } catch (error) {
      console.error('error:', error.details);
    }
  }

  async run() {
    await this.invokeStatic();
  }
}
