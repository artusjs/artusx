import { Injectable, ScopeEnum } from '@artus/core';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { InjectEnum } from './constants';

export interface SequelizeConfig extends SequelizeOptions {
  database: string;
  username: string;
  password: string;
  host: string;
  force?: boolean;
  alter?: boolean;
}

@Injectable({
  id: InjectEnum.Sequelize,
  scope: ScopeEnum.SINGLETON,
})
export default class SequelizeClient {
  private sequelize: Sequelize;

  async init(config: SequelizeConfig) {
    if (!config) {
      return;
    }

    const { force = false, alter = false, ...restConfig } = config;

    this.sequelize = new Sequelize({
      ...restConfig,
      logging: false,
      repositoryMode: true,
    });

    await this.sequelize.sync({
      force,
      alter,
    });
  }

  getClient(): Sequelize {
    return this.sequelize;
  }
}

export { Sequelize };
