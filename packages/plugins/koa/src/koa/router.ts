import Router from 'find-my-way';
import { ArtusInjectEnum, Inject, Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from '../constants';
import { ArtusXConfig, KoaRouter } from '../types';
import { getBooleanFromEnv } from '../util';

@Injectable({
  id: InjectEnum.KoaRouter,
  scope: ScopeEnum.SINGLETON,
})
export default class KoaRouterClient extends (Router as any as KoaRouter) {
  constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
    const conf = (config.artusx || {}) as ArtusXConfig;
    const {
      caseSensitive = getBooleanFromEnv('ROUTER_CASE_SENSITIVE', true),
      ignoreTrailingSlash = getBooleanFromEnv('ROUTER_IGNORE_TRAILING_SLASH', true),
      ignoreDuplicateSlashes = getBooleanFromEnv('ROUTER_IGNORE_DUPLICATE_SLASHES', true),
    } = conf.router || {};

    super({
      caseSensitive,
      ignoreTrailingSlash,
      ignoreDuplicateSlashes,
    });
  }
}

export { KoaRouterClient };
