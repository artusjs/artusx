import Router from '@koa/router';
import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from '../constants';

@Injectable({
  id: ArtusXInjectEnum.KoaRouter,
  scope: ScopeEnum.SINGLETON,
})
export default class KoaRouter extends Router {}
