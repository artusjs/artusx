import assert from 'assert';
import xtransit from 'xtransit';
import xprofiler from 'xprofiler';
import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';

@LifecycleHookUnit()
export default class XtransitLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  async didLoad() {
    const config = this.app.config.xtransit;
    xprofiler.start({
      log_dir: config.logDir,
      log_interval: config.logInterval || 120,
      check_throw: config.checkThrow || false,
    });
  }

  @LifecycleHook()
  async didReady() {
    const config = this.app.config.xtransit;
    const { server, appId, appSecret } = config;

    assert(
      server && appId && appSecret,
      'xtransit config error, server, appId, appSecret must be passed in.'
    );

    // logger
    const logger = {};
    for (const method of ['info', 'warn', 'error', 'debug']) {
      logger[method] = (message, ...args) => {
        this.logger[method](`[xtransit] ${message}`, ...args);
      };
    }

    xtransit.start({
      logger,
      ...config,
    });
  }
}
