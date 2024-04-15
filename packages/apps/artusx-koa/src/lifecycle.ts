import {
  Inject,
  ApplicationLifecycle,
  LifecycleHook,
  LifecycleHookUnit,
  KoaApplication,
  ArtusXInjectEnum,
} from '@artusx/core';

@LifecycleHookUnit()
export default class CustomLifecycle implements ApplicationLifecycle {
  @Inject(ArtusXInjectEnum.Koa)
  private readonly koa: KoaApplication;

  @LifecycleHook()
  async didLoad() {}

  @LifecycleHook()
  public async willReady() {
    this.koa.on('error', (err) => {
      console.error('koa error', err);
    });
  }
}
