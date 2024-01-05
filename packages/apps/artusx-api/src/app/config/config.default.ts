import path from 'path';
import dotenv from 'dotenv';

import checkAuth from '../middleware/checkAuth';

dotenv.config();

export default {
  koa: {
    port: 7001
    // middlewares: []
  },

  artusx: {
    middlewares: [checkAuth]
  },

  redis: {
    db: process.env.REDIS_DATABASE || 0,
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    username: process.env.REDIS_USERNAME || '',
    password: process.env.REDIS_PASSWORD || ''
  },

  sequelize: {
    port: process.env.MYSQL_PORT || 3306,
    host: process.env.MYSQL_HOST || 'localhost',
    database: process.env.MYSQL_DATABASE || 'mysql',
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    dialect: 'mysql',
    models: [path.join(__dirname, '../model')],
    force: Boolean(process.env.MYSQL_FORCE) || false,
    alter: Boolean(process.env.MYSQL_ALTER) || false
  }
};
