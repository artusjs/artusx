import { Server } from 'http';
import { LifecycleHookUnit, LifecycleHook } from '@artus/core';
import { ApplicationLifecycle } from '@artus/core';
import { ArtusApplication, Inject, ArtusInjectEnum } from '@artus/core';

import Redis, { RedisConfig } from './client';

export let server: Server;

@LifecycleHookUnit()
export default class RedisLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const sequelize = this.app.container.get('ARTUS_REDIS') as Redis;
    await sequelize.init(this.app.config.redis as RedisConfig);
  }
}
