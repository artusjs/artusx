import {
  Inject,
  ArtusInjectEnum,
  ArtusApplication,
  ApplicationLifecycle,
  LifecycleHook,
  LifecycleHookUnit
} from '@artus/core';

import cors from '@koa/cors';
import { bodyParser } from '@koa/bodyparser';
import { KoaApplication } from '@artusx/plugin-koa';

@LifecycleHookUnit()
export default class ArtusXCoreLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  private readonly app: ArtusApplication;

  get koa(): KoaApplication {
    return this.app.container.get(KoaApplication);
  }

  @LifecycleHook()
  async didLoad() {
    const koa = this.koa;

    koa.use(
      bodyParser({
        encoding: 'utf-8',
        onError(_err, ctx) {
          ctx.throw(422, 'body parse error');
        }
      })
    );

    koa.use(
      cors({
        credentials: true,
        origin(ctx) {
          return ctx.get('Origin') || 'localhost';
        }
      })
    );
  }
}
