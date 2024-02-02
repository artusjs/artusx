import log4js from 'log4js';
import type { Log4js, Configuration, Logger } from 'log4js';

import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';

@Injectable({
  id: ArtusXInjectEnum.Client,
  scope: ScopeEnum.SINGLETON,
})
export default class Log4jsClient {
  private log4js: Log4js;

  async init(config: Configuration) {
    if (!config) {
      return;
    }

    this.log4js = log4js.configure({
      ...config,
    });
  }

  getLogger(adapter: string): Logger {
    return this.log4js.getLogger(adapter);
  }

  get logger(): Logger {
    return this.log4js.getLogger('console');
  }
}
