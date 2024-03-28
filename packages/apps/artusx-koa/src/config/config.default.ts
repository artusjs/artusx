import os from 'os';
import fs from 'fs-extra';
import path from 'path';

import {
  ArtusxConfig,
  LoggerOptions,
  LoggerLevel,
  Log4jsConfiguration,
  NunjucksConfigureOptions,
  XprofilerConfig,
  XtransitConfig,
} from '@artusx/core';

import type { EjsConfig } from '@artusx/plugin-ejs';
import type { RedisConfig } from '@artusx/plugin-redis';
import type { SequelizeConfig } from '@artusx/plugin-sequelize';

import { getEnv } from '@artusx/utils';

import LimitRate from '../middleware/LimitRate';
import checkAuth from '../middleware/checkAuth';

const tmpDir = os.tmpdir();
const rootDir = path.resolve(__dirname, '../..');
const logsDir = path.join(tmpDir, 'artusx/logs');
const xprofilerLogDir = path.join(logsDir, 'xprofiler');

export default () => {
  fs.ensureDirSync(logsDir);
  fs.ensureDirSync(xprofilerLogDir);

  const artusx: ArtusxConfig = {
    port: 7001,
    middlewares: [LimitRate, checkAuth],
    static: {
      dirs: [
        {
          prefix: '/public/',
          dir: path.resolve(__dirname, '../public'),
        },
      ],
      dynamic: true,
      preload: false,
      buffer: false,
      maxFiles: 1000,
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
      credentials: false,
    },
  };

  const redis: RedisConfig = {
    db: getEnv('REDIS_DATABASE', 'number') || 0,
    port: getEnv('REDIS_PORT', 'number') || 6379,
    host: getEnv('REDIS_HOST', 'string') || 'localhost',

    username: getEnv('REDIS_USERNAME', 'string') || '',
    password: getEnv('REDIS_PASSWORD', 'string') || '',
  };

  const sequelize: SequelizeConfig = {
    port: getEnv('MYSQL_PORT', 'number') || 3306,
    host: getEnv('MYSQL_HOST', 'string') || 'localhost',

    database: getEnv('MYSQL_DATABASE', 'string') || 'mysql',
    username: getEnv('MYSQL_USERNAME', 'string') || 'root',
    password: getEnv('MYSQL_PASSWORD', 'string') || 'root',

    dialect: 'mysql',
    models: [path.join(__dirname, '../model')],

    force: getEnv('MYSQL_FORCE', 'boolean') || false,
    alter: getEnv('MYSQL_ALTER', 'boolean') || false,
  };

  const logger: LoggerOptions = {
    level: LoggerLevel.DEBUG,
  };

  const nunjucks: NunjucksConfigureOptions = {
    path: path.resolve(__dirname, '../view'),
    options: {
      autoescape: true,
      noCache: true,
    },
  };

  const ejs: EjsConfig = {
    root: path.resolve(__dirname, '../view-ejs'),
    async: true,
    layout: {
      'layout extractScripts': true,
      'layout extractStyles': true,
      // layout: false,
    },
  };

  const log4js: Log4jsConfiguration = {
    appenders: {
      console: { type: 'console' },
      info: { type: 'file', filename: `${logsDir}/info.log` },
      error: { type: 'file', filename: `${logsDir}/error.log` },
    },
    categories: {
      console: {
        appenders: ['console'],
        level: 'info',
      },
      error: {
        appenders: ['error'],
        level: 'error',
      },
      default: {
        appenders: ['info'],
        level: 'info',
      },
    },
  };

  const xprofiler: XprofilerConfig = {
    log_level: 0,
    enable_http_profiling: true,
  };

  const xtransit: XtransitConfig = {
    server: 'ws://127.0.0.1:9190',
    appId: 1,
    appSecret: '88115b3f0881348fe4a8935b103c0a74',

    logDir: xprofilerLogDir,

    errors: [`${logsDir}/info.log`, `${logsDir}/error.log`],
    packages: [`${rootDir}/package.json`],
  };

  return {
    // artusx
    artusx,

    // logger
    logger,

    // log4js
    log4js,

    // ejs
    ejs,

    // nunjucks
    nunjucks,

    // xtransit
    xprofiler,
    xtransit,

    // redis
    redis,

    // sequelize
    sequelize,
  };
};
