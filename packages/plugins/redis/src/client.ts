import { Injectable, ScopeEnum } from '@artus/core';
import { Redis, RedisOptions } from 'ioredis';
import { InjectEnum } from './constants';

export interface RedisConfig extends RedisOptions {
  host: string;
  port: number;
  username?: string;
  password?: string;
  db: number;
}

@Injectable({
  id: InjectEnum.Redis,
  scope: ScopeEnum.SINGLETON,
})
export default class RedistClient {
  private redis: Redis;

  async init(config: RedisConfig) {
    if (!config) {
      return;
    }

    this.redis = new Redis(config);
  }

  getClient(): Redis {
    return this.redis;
  }
}
