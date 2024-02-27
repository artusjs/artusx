import Router from '@koa/router';
import type IRouter from '@koa/router';
import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from '../constants';

interface IKoaRouter extends IRouter {}

@Injectable({
  id: ArtusXInjectEnum.KoaRouter,
  scope: ScopeEnum.SINGLETON,
})
export default class KoaRouterClient extends Router implements IKoaRouter {}

export { KoaRouterClient };
