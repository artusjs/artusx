import Router from 'find-my-way';
import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from '../constants';
import { KoaRouter } from '../types';

@Injectable({
  id: ArtusXInjectEnum.KoaRouter,
  scope: ScopeEnum.SINGLETON,
})
export default class KoaRouterClient extends (Router as any as KoaRouter) {}

export { KoaRouterClient };
