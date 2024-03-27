import { Inject } from '@artus/core';
import { Schedule } from '@artusx/plugin-schedule';
import type { ArtusxSchedule } from '@artusx/plugin-schedule';
import { ClientMessage } from '../proto-codegen/chat';
import ChatClient from './chat.client';

@Schedule({
  enable: true,
  cron: '30 * * * * *',
  runOnInit: true,
})
export default class NotifySchedule implements ArtusxSchedule {
  @Inject(ChatClient)
  chat: ChatClient;

  private async invokeStatic() {
    const chatClient = this.chat.getClient();

    const message = new ClientMessage({
      user: '@client',
      text: 'hello',
    });

    try {
      const response = await chatClient.join(message);
      console.log('client:Chat:join', response.toObject());
    } catch (error) {
      console.error('error:', error.details);
    }
  }

  async run() {
    await this.invokeStatic();
  }
}
