import path from 'path';
import dotenv from 'dotenv';

import { ArtusxConfig } from '@artusx/core';
import type { RedisConfig } from '@artusx/plugin-redis';
import type { SequelizeConfig } from '@artusx/plugin-sequelize';
import { getEnv } from '../util';

dotenv.config();

const basicConfig: ArtusxConfig = {
  koa: {
    port: 7001,
  },
};

const redisConfig: RedisConfig = {
  db: getEnv('REDIS_DATABASE', 'number') || 0,
  port: getEnv('REDIS_PORT', 'number') || 6379,
  host: getEnv('REDIS_HOST', 'string') || 'localhost',
  username: process.env.REDIS_USERNAME || '',
  password: process.env.REDIS_PASSWORD || '',
};

const sequelizeConfig: SequelizeConfig = {
  port: getEnv('MYSQL_PORT', 'number') || 3306,
  host: getEnv('MYSQL_HOST', 'string') || 'localhost',
  database: process.env.MYSQL_DATABASE || 'mysql',
  username: process.env.MYSQL_USERNAME || 'root',
  password: process.env.MYSQL_PASSWORD || 'root',
  dialect: 'mysql',
  models: [path.join(__dirname, '../model')],
  force: getEnv('MYSQL_FORCE', 'boolean') || false,
  alter: getEnv('MYSQL_ALTER', 'boolean') || false,
};

export default {
  ...basicConfig,
  redis: redisConfig,
  sequelize: sequelizeConfig,
} as Record<string, object>;
