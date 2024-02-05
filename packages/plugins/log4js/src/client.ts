import log4js from 'log4js';
import type { Log4js, Configuration as Log4jsConfiguration, Logger as Log4jsLogger } from 'log4js';

import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';

@Injectable({
  id: ArtusXInjectEnum.Client,
  scope: ScopeEnum.SINGLETON,
})
export default class Log4jsClient {
  private log4js: Log4js;

  async init(config: Log4jsConfiguration) {
    if (!config) {
      return;
    }

    this.log4js = log4js.configure({
      ...config,
    });
  }

  getLogger(adapter?: string): Log4jsLogger {
    return this.log4js.getLogger(adapter);
  }

  get logger(): Log4jsLogger {
    return this.log4js.getLogger();
  }
}

export { Log4js, Log4jsLogger, Log4jsConfiguration };
