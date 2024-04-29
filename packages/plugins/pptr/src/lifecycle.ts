import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { InjectEnum } from './constants';
import PPTRClient, { PPTRConfig } from './client';

@LifecycleHookUnit()
export default class PPTRLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const config: PPTRConfig = this.app.config.pptr;

    if (!config || (!config.connect && !config.launch)) {
      return;
    }

    const client = this.app.container.get(InjectEnum.PPTR) as PPTRClient;
    await client.init(config);
  }
}
