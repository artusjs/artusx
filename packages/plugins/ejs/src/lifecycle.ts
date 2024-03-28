import assert from 'assert';
import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import Client, { EjsConfig } from './client';

@LifecycleHookUnit()
export default class EjsLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  async willReady() {
    const config: EjsConfig = this.app.config.ejs;
    assert(config && config.root, 'root dir is required');

    this.logger.info('[ejs] serving view at: %s', config.root);
    const client = this.app.container.get(ArtusXInjectEnum.EJS) as Client;
    await client.init(config);
  }
}
