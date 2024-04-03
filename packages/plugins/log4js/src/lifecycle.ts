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

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  async willReady() {
    const silent = this.app.config.silent?.log4js || false;
    const config = this.app.config.log4js || defaultLog4jsConfig;

    if (!silent) {
      this.logger.info('[log4js] starting log4js with appenders: \n %o', config.appenders);
    }

    const client = this.app.container.get(ArtusXInjectEnum.Client) as Client;
    await client.init(config);
  }
}
