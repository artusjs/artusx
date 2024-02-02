import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import { defaultLog4jsConfig } from './constants';
import Client from './client';

@LifecycleHookUnit()
export default class Log4jsLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const client = this.app.container.get(ArtusXInjectEnum.Client) as Client;
    await client.init(this.app.config.log4js || defaultLog4jsConfig);
  }
}
