import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import Client, { TelegramConfig } from './client';

@LifecycleHookUnit()
export default class TelegramLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const config: TelegramConfig = this.app.config.telegram;
    if (!config || !config.session_string) {
      return;
    }

    const client = this.app.container.get(ArtusXInjectEnum.Telegram) as Client;
    await client.init(config);
  }
}
