import { LifecycleHookUnit, LifecycleHook } from '@artus/core';
import { ApplicationLifecycle } from '@artus/core';
import { ArtusApplication, Inject, ArtusInjectEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import Sequelize, { SequelizeConfig } from './client';

@LifecycleHookUnit()
export default class SequelizeLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  async willReady() {
    const config: SequelizeConfig = this.app.config.sequelize;

    if (!config || !config.host) {
      return;
    }

    this.logger.info('[sequelize] staring sequelize with host: %s', config.host);
    const sequelize = this.app.container.get(ArtusXInjectEnum.Sequelize) as Sequelize;
    await sequelize.init(config);
  }
}
