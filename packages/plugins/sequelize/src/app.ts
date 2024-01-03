import { LifecycleHookUnit, LifecycleHook } from '@artus/core';
import { ApplicationLifecycle } from '@artus/core';
import { ArtusApplication, Inject, ArtusInjectEnum } from '@artus/core';

import Sequelize, { SequelizeConfig } from './client';

@LifecycleHookUnit()
export default class SequelizeLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const sequelize = this.app.container.get('ARTUS_SEQUELIZE') as Sequelize;
    await sequelize.init(this.app.config.sequelize as SequelizeConfig);
  }
}
