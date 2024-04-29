import { ApplicationLifecycle, ArtusApplication, Inject, ArtusInjectEnum, LifecycleHookUnit, LifecycleHook } from '@artus/core';
import { InjectEnum } from './constants';
import Client from './client';

@LifecycleHookUnit()
export default class PluginLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const client = this.app.container.get(InjectEnum.Client) as Client;
    await client.init(this.app.config.{{name}});
  }
}
