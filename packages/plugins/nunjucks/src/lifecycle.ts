import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import Client from './client';

@LifecycleHookUnit()
export default class NunjucksLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  async willReady() {
    this.logger.info('[nunjucks] serving view at: %s', this.app.config.nunjucks.path);
    const client = this.app.container.get(ArtusXInjectEnum.Client) as Client;
    await client.init(this.app.config.nunjucks);
  }
}
