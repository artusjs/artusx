import { LifecycleHookUnit, LifecycleHook } from '@artus/core';
import { ApplicationLifecycle } from '@artus/core';
import { ArtusApplication, Inject, ArtusInjectEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import Redis, { RedisConfig } from './client';

@LifecycleHookUnit()
export default class RedisLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const redis = this.app.container.get(ArtusXInjectEnum.Redis) as Redis;
    await redis.init(this.app.config.redis as RedisConfig);
  }
}
