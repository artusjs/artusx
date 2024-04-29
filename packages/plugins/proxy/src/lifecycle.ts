import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { InjectEnum } from './constants';
import ProxyClient, { ProxyConfig } from './client';

@LifecycleHookUnit()
export default class ProxyLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const config: ProxyConfig = this.app.config.proxy;

    if (!config || !config.proxyString) {
      return;
    }

    const client = this.app.container.get(InjectEnum.Proxy) as ProxyClient;
    await client.init(config);
  }
}
