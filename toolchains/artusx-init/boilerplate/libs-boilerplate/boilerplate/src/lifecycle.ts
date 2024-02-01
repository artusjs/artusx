import { ArtusApplication, Inject, ArtusInjectEnum, LifecycleHookUnit, LifecycleHook, ApplicationLifecycle } from '@artus/core';

@LifecycleHookUnit()
export default class RedisLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    console.log('LifecycleHook:willReady');
  }
}
