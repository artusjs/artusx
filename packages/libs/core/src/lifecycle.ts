import assert from 'assert';

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
import compose from 'koa-compose';
import compression from 'koa-compress';
import staticCache from 'koa-static-cache';

import { bodyParser } from '@koa/bodyparser';
import { ArtusxConfig } from './types';
import { KoaApplicationClient } from '@artusx/plugin-koa';
import type { KoaApplication } from '@artusx/plugin-koa';

@LifecycleHookUnit()
export default class ArtusXCoreLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  private readonly app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  get koa(): KoaApplication {
    return this.app.container.get(KoaApplicationClient);
  }

  private registerStatic() {
    const { static: options } = this.app.config.artusx as ArtusxConfig;

    if (!options) {
      return;
    }

    const rangeMiddleware = (ctx, next) => {
      // if match static file, and use range middleware.
      const isMatch = prefixs.some((p) => ctx.path.startsWith(p));
      if (isMatch) {
        return range(ctx, next);
      }
      return next();
    };

    const dirs = (options?.dirs || []).concat(options?.dir || []);
    const prefixs: string[] = [];
    const middlewares = [rangeMiddleware];

    for (const dirObj of dirs) {
      let newOptions;

      if (typeof dirObj === 'string') {
        newOptions = {
          ...options,
          dir: dirObj,
        };
      } else {
        assert(
          typeof dirObj?.dir === 'string',
          '`static.dir` should contains `[].dir` property when object style.'
        );
        newOptions = {
          ...options,
          ...dirObj,
        };
      }

      if (newOptions.dynamic && !newOptions.files) {
        newOptions.files = new LRU(newOptions.maxFiles);
      }

      if (newOptions.prefix) {
        prefixs.push(newOptions.prefix);
      }

      // ensure directory exists
      if (!existsSync(newOptions.dir)) {
        mkdirSync(newOptions.dir, { recursive: true });
      }

      this.logger.info('[static] starting static serve %s -> %s', newOptions.prefix, newOptions.dir);

      middlewares.push(staticCache(newOptions));
    }

    this.koa.use(compose(middlewares));
  }

  private registerCors() {
    const { cors: corsConfig } = this.app.config.artusx as ArtusxConfig;

    if (!corsConfig) {
      this.koa.use(cors());
      return;
    }

    this.koa.use(cors(corsConfig));
  }

  @LifecycleHook()
  async didLoad() {
    this.koa.use(compression());

    this.koa.use(
      bodyParser({
        encoding: 'utf-8',
        onError(_err, ctx) {
          ctx.throw(422, 'body parse error');
        },
      })
    );

    this.registerCors();
    this.registerStatic();
  }
}
