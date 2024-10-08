import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { ClickHouseConfig, ClickHouseClient } from './client';
import { InjectEnum } from './constants';

@LifecycleHookUnit()
export default class PluginLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  public async willReady() {
    const config: ClickHouseConfig = this.app.config.clickhouse;

    if (!config || !config.url) {
      return;
    }

    this.logger.info('[clickhouse] staring clickhouse with url: %s', config.url);
    const clickhouse = this.app.container.get(InjectEnum.Client) as ClickHouseClient;
    await clickhouse.init(config);
  }
}
