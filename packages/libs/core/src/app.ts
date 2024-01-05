import {
  Inject,
  ArtusInjectEnum,
  ArtusApplication,
  ApplicationLifecycle,
  LifecycleHook,
  LifecycleHookUnit
} from '@artus/core';

import cors from '@koa/cors';
import KoaApplication from '@artusx/plugin-application-http/lib/koa/application';

@LifecycleHookUnit()
export default class ArtusXCoreLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  private readonly app: ArtusApplication;

  get koa(): KoaApplication {
    return this.app.container.get(KoaApplication);
  }

  @LifecycleHook()
  async didLoad() {
    this.koa.use(
      cors({
        credentials: true,
        origin(ctx) {
          return ctx.get('Origin') || 'localhost';
        }
      })
    );
  }
}
