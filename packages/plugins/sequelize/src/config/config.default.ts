import { SequelizeConfig } from '../client';

export default {
  sequelize: {
    database: 'mysql',
    username: 'root',
    password: 'root',
    host: 'localhost',
    dialect: 'mysql'
  } as SequelizeConfig
};
