import Koa from 'koa';
import type IKoa from 'koa';
import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from '../constants';

interface IKoaApplication extends IKoa {}

@Injectable({
  id: ArtusXInjectEnum.Koa,
  scope: ScopeEnum.SINGLETON,
})
export default class KoaApplicationClient extends Koa implements IKoaApplication {
  constructor() {
    super({
      keys: process.env.KOA_KEYS?.split(',') ?? ['artusx'],
    });
  }
}

export { KoaApplicationClient };
