import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { InjectEnum } from './constants';
import Client, { NunjucksConfigureOptions } from './client';

@LifecycleHookUnit()
export default class NunjucksLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  async willReady() {
    const config: NunjucksConfigureOptions = this.app.config.nunjucks;

    if (!config || !config.path) {
      return;
    }

    this.logger.info('[nunjucks] serving view at: %s', config.path);
    const client = this.app.container.get(InjectEnum.Nunjucks) as Client;
    await client.init(config);
  }
}
