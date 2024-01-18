import Koa from 'koa';
import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from '../constants';

@Injectable({
  id: ArtusXInjectEnum.Koa,
  scope: ScopeEnum.SINGLETON
})
export default class KoaApplication extends Koa {
  constructor() {
    super({
      keys: process.env.KOA_KEYS?.split(',') ?? ['artusx']
    });
  }
}
