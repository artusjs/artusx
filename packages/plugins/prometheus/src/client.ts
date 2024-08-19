import { Injectable, Inject, ScopeEnum, ArtusInjectEnum } from '@artus/core';
import {
  register,
  collectDefaultMetrics,
  Histogram,
  Counter,
  Gauge,
  Summary,
  Registry,
  Pushgateway,
} from 'prom-client';
import { InjectEnum } from './constants';

export type PrometheusConfig = {
  prefix?: string;
};

@Injectable({
  id: InjectEnum.Client,
  scope: ScopeEnum.SINGLETON,
})
export default class Client {
  _config: any;

  constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
    this._config = config || {};
  }

  async init(config: PrometheusConfig) {
    const prefix = config?.prefix || 'artusx_';
    collectDefaultMetrics({
      prefix,
    });
  }

  getRegister() {
    return register;
  }

  async getMetrics() {
    return register.metrics();
  }
}

export { register, Registry, Pushgateway, Histogram, Counter, Gauge, Summary };
