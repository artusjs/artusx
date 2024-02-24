import { LifecycleHookUnit, LifecycleHook } from '@artus/core';
import { ApplicationLifecycle } from '@artus/core';
import { ArtusApplication, Inject, ArtusInjectEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import Redis, { RedisConfig } from './client';

@LifecycleHookUnit()
export default class RedisLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  async willReady() {
    this.logger.info('[redis] staring redis with host: %s', this.app.config.redis.host);
    const redis = this.app.container.get(ArtusXInjectEnum.Redis) as Redis;
    await redis.init(this.app.config.redis as RedisConfig);
  }
}
