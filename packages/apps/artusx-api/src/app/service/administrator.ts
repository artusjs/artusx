import { Inject, Injectable, ArtusInjectEnum, ArtusApplication } from '@artusx/core';
import { Sequelize, Repository } from 'sequelize-typescript';

import ISequelizeClient from '@artusx/plugin-sequelize/client';
import { AdministratorModel } from '../model/administrator';

@Injectable()
export default class AdministratorService {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @Inject('ARTUS_SEQUELIZE')
  sequelizeClient: ISequelizeClient;

  get sequelize() {
    const sequelize: Sequelize = this.sequelizeClient.getClient();
    return sequelize;
  }

  get administrator(): Repository<AdministratorModel> {
    const administratorRepository = this.sequelize.getRepository(AdministratorModel);
    return administratorRepository;
  }

  async checkAdministrator(chatId: string) {
    const administrator = await this.administrator.findOne({
      where: {
        user_id: chatId,
      },
    });

    return administrator;
  }
}
