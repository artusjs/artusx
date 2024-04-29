import Koa from 'koa';
import type IKoa from 'koa';
import { Injectable, ScopeEnum, Inject, ArtusInjectEnum } from '@artus/core';
import { ArtusXConfig } from '../types';
import { InjectEnum } from '../constants';

interface IKoaApplication extends IKoa {}

@Injectable({
  id: InjectEnum.Koa,
  scope: ScopeEnum.SINGLETON,
})
export default class KoaApplicationClient extends Koa implements IKoaApplication {
  constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
    const conf = config.artusx as ArtusXConfig;
    const keys = process.env.KOA_KEYS?.split(',') ?? conf.keys?.split(',') ?? ['artusx'];
    super({
      keys,
    });
  }
}

export { KoaApplicationClient };
