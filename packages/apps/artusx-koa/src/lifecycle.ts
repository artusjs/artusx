import { Inject, ApplicationLifecycle, LifecycleHook, LifecycleHookUnit, KoaApplication } from '@artusx/core';
import { ArtusXInjectEnum } from '@artusx/utils';

@LifecycleHookUnit()
export default class CustomLifecycle implements ApplicationLifecycle {
  @Inject(ArtusXInjectEnum.Koa)
  private readonly koa: KoaApplication;

  @LifecycleHook()
  async didLoad() {}

  @LifecycleHook()
  public async willReady() {
    this.koa.use(async (_ctx, next) => {
      await next();
    });
  }
}
