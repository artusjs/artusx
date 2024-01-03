import { Injectable, ScopeEnum } from '@artus/core';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

export interface SequelizeConfig extends SequelizeOptions {
  database: string;
  username: string;
  password: string;
  host: string;
  force?: boolean;
  alter?: boolean;
}

@Injectable({
  id: 'ARTUS_SEQUELIZE',
  scope: ScopeEnum.SINGLETON
})
export default class Client {
  private sequelize: Sequelize;

  async init(config: SequelizeConfig) {
    if (!config) {
      return;
    }

    const { force = false, alter = false, ...restConfig } = config;

    this.sequelize = new Sequelize({
      ...restConfig,
      logging: false,
      repositoryMode: true
    });

    await this.sequelize.sync({
      force,
      alter
    });
  }

  getClient(): Sequelize {
    return this.sequelize;
  }
}
