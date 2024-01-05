import path from 'path';
import dotenv from 'dotenv';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import checkAuth from '../middleware/checkAuth';
import { KoaContext, KoaNext, RedisConfig, SequelizeConfig } from '../types';
import { ArtusxConfig } from '@artusx/core';
import { getEnv } from '../util';

dotenv.config();

const rateLimiterOptions = {
  points: 6,
  duration: 1
};

const rateLimiter = new RateLimiterMemory(rateLimiterOptions);

const basicConfig: ArtusxConfig = {
  koa: {
    port: 7001,
    middlewares: [
      async function LimitRate(ctx: KoaContext, next: KoaNext) {
        try {
          const rateLimiterRes = await rateLimiter.consume(ctx.ip);
          ctx.set('Retry-After', `${rateLimiterRes.msBeforeNext / 1000}`);
          ctx.set('X-RateLimit-Limit', `${rateLimiterOptions.points}`);
          ctx.set('X-RateLimit-Remaining', `${rateLimiterRes.remainingPoints}`);
          ctx.set('X-RateLimit-Reset', `${new Date(Date.now() + rateLimiterRes.msBeforeNext)}`);
        } catch (rejRes) {
          ctx.status = 429;
          ctx.body = 'Too Many Requests';
          return;
        }
        await next();
      }
    ]
  },

  artusx: {
    middlewares: [checkAuth]
  }
};

const redisConfig: RedisConfig = {
  db: getEnv('REDIS_DATABASE', 'number') || 0,
  port: getEnv('REDIS_PORT', 'number') || 6379,
  host: getEnv('REDIS_HOST', 'string') || 'localhost',
  username: process.env.REDIS_USERNAME || '',
  password: process.env.REDIS_PASSWORD || ''
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
  alter: getEnv('MYSQL_ALTER', 'boolean') || false
};

export default {
  ...basicConfig,
  redis: redisConfig,
  sequelize: sequelizeConfig
} as Record<string, any>;
