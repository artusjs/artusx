import { Inject } from '@artus/core';
import { Schedule } from '@artusx/plugin-schedule';
import type { ArtusxSchedule } from '@artusx/plugin-schedule';

import EchoClient from './echo.client';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusxSchedule {
  @Inject(EchoClient)
  echoClient: EchoClient;

  private async invokeDynamic() {
    this.echoClient.UnaryEcho({ message: 'ping' }, function (_err: Error, response: any) {
      console.log('client:Echo:UnaryEcho', response);
    });
  }

  async run() {
    await this.invokeDynamic();
  }
}
