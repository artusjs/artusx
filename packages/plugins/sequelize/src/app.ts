import { LifecycleHookUnit, LifecycleHook } from '@artus/core';
import { ApplicationLifecycle } from '@artus/core';
import { ArtusApplication, Inject, ArtusInjectEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import Sequelize, { SequelizeConfig } from './client';

@LifecycleHookUnit()
export default class SequelizeLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const sequelize = this.app.container.get(ArtusXInjectEnum.Sequelize) as Sequelize;
    await sequelize.init(this.app.config.sequelize as SequelizeConfig);
  }
}
