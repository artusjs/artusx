import {
  Inject,
  ArtusInjectEnum,
  ArtusApplication,
  ApplicationLifecycle,
  LifecycleHook,
  LifecycleHookUnit,
} from '@artus/core';

import { existsSync, mkdirSync } from 'fs';
import LRU from 'ylru';
import cors from '@koa/cors';
import range from 'koa-range';
import staticCache from 'koa-static-cache';

import { bodyParser } from '@koa/bodyparser';
import { KoaApplication } from '@artusx/plugin-koa';
import { ArtusxConfig } from './types';

@LifecycleHookUnit()
export default class ArtusXCoreLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  private readonly app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  get koa(): KoaApplication {
    return this.app.container.get(KoaApplication);
  }

  private registerStatic() {
    const prefixs: string[] = [];
    const { static: staticConfig } = this.app.config.artusx as ArtusxConfig;

    if (!staticConfig || !staticConfig.dir || !staticConfig.prefix) {
      return;
    }

    let staticCacheOptions: any = { ...staticConfig } || {};

    if (staticCacheOptions.dynamic && !staticCacheOptions.files) {
      staticCacheOptions.files = new LRU(staticCacheOptions.maxFiles || 31536000);
    }

    if (staticCacheOptions.prefix) {
      prefixs.push(staticCacheOptions.prefix);
    }

    if (!existsSync(staticCacheOptions.dir)) {
      mkdirSync(staticCacheOptions.dir, { recursive: true });
    }

    this.logger.info(
      '[static] starting static serve %s -> %s',
      staticCacheOptions.prefix,
      staticCacheOptions.dir
    );

    this.koa.use((ctx, next) => {
      // if match static file, and use range middleware.
      const isMatch = prefixs.some((p) => ctx.path.startsWith(p));
      if (isMatch) {
        return range(ctx, next);
      }
      return next();
    });

    this.koa.use(staticCache(staticCacheOptions));
  }

  @LifecycleHook()
  async didLoad() {
    this.koa.use(
      bodyParser({
        encoding: 'utf-8',
        onError(_err, ctx) {
          ctx.throw(422, 'body parse error');
        },
      })
    );

    this.koa.use(
      cors({
        credentials: true,
        origin(ctx) {
          return ctx.get('Origin') || 'localhost';
        },
      })
    );

    this.registerStatic();
  }
}
