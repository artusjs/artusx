import { Inject, Injectable, ArtusInjectEnum, ArtusApplication } from '@artusx/core';
import { Sequelize, Repository } from 'sequelize-typescript';

import ISequelizeClient from '@artusx/plugin-sequelize/client';
import { UserModel } from '../model/user';

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

  get user(): Repository<UserModel> {
    const userRepository = this.sequelize.getRepository(UserModel);
    return userRepository;
  }

  async checkAdministrator(chatId: string) {
    const user = await this.user.findOne({
      where: {
        user_id: chatId,
      },
    });

    return user;
  }
}
