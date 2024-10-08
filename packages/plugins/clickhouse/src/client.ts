import { Injectable, Inject, ScopeEnum, ArtusInjectEnum } from '@artus/core';
import { createClient } from '@clickhouse/client';
import type { NodeClickHouseClient } from '@clickhouse/client/dist/client';
import type { NodeClickHouseClientConfigOptions } from '@clickhouse/client/dist/config';
import { InjectEnum } from './constants';

export type ClickHouseConfig = NodeClickHouseClientConfigOptions & {
  prefix?: string;
};

@Injectable({
  id: InjectEnum.Client,
  scope: ScopeEnum.SINGLETON,
})
export class ClickHouseClient {
  _config: any;

  private clickhouseClient: NodeClickHouseClient;

  constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
    this._config = config || {};
  }

  async init(config: ClickHouseConfig) {
    if (!config.url) {
      return;
    }

    this.clickhouseClient = createClient(config);
  }

  getClient() {
    return this.clickhouseClient;
  }
}

export default ClickHouseClient;
