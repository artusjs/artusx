import Router from 'find-my-way';
import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from '../constants';
import { KoaRouter } from '../types';
import { getBooleanFromEnv } from '../util';

@Injectable({
  id: ArtusXInjectEnum.KoaRouter,
  scope: ScopeEnum.SINGLETON,
})
export default class KoaRouterClient extends (Router as any as KoaRouter) {
  constructor() {
    super({
      caseSensitive: getBooleanFromEnv('ROUTER_CASE_SENSITIVE', true),
      ignoreTrailingSlash: getBooleanFromEnv('ROUTER_IGNORE_TRAILING_SLASH', true),
      ignoreDuplicateSlashes: getBooleanFromEnv('ROUTER_IGNORE_DUPLICATE_SLASHES', true),
    });
  }
}

export { KoaRouterClient };
