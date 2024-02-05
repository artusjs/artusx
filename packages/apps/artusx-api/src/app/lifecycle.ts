import {
  Inject,
  ArtusInjectEnum,
  ArtusApplication,
  ApplicationLifecycle,
  LifecycleHook,
  LifecycleHookUnit,
} from '@artus/core';

import { KoaApplication } from '@artusx/core';

@LifecycleHookUnit()
export default class CustomLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  private readonly app: ArtusApplication;

  get koa(): KoaApplication {
    return this.app.container.get(KoaApplication);
  }

  @LifecycleHook()
  async didLoad() {}

  @LifecycleHook()
  public async willReady() {
    this.koa.use(async (_ctx, next) => {
      console.log('ctx');
      await next();
    });
  }
}
