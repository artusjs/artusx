import Koa from 'koa';
import type IKoa from 'koa';
import { Injectable, ScopeEnum, Inject, ArtusInjectEnum } from '@artus/core';
import { ArtusxConfig } from '../types';
import { ArtusXInjectEnum } from '../constants';

interface IKoaApplication extends IKoa {}

@Injectable({
  id: ArtusXInjectEnum.Koa,
  scope: ScopeEnum.SINGLETON,
})
export default class KoaApplicationClient extends Koa implements IKoaApplication {
  constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
    const conf = config.artusx as ArtusxConfig;
    const keys = process.env.KOA_KEYS?.split(',') ?? conf.keys?.split(',') ?? ['artusx'];
    super({
      keys,
    });
  }
}

export { KoaApplicationClient };
