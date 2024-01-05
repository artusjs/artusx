import { Injectable, ScopeEnum } from '@artus/core';
import { Redis, RedisOptions } from 'ioredis';
import { ArtusXInjectEnum } from './constants';

export interface RedisConfig extends RedisOptions {
  host: string;
  port: number;
  username?: string;
  password?: string;
  db: number;
}

@Injectable({
  id: ArtusXInjectEnum.Redis,
  scope: ScopeEnum.SINGLETON
})
export default class Client {
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
