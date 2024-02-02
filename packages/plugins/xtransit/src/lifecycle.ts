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

import type { XtransitConfig } from 'xtransit';
import type { XprofilerConfig } from 'xprofiler';

@LifecycleHookUnit()
export default class XtransitLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  async didLoad() {
    const xtransitConfig = this.app.config.xtransit;
    const xprofilerConfig: XprofilerConfig = this.app.config.xprofiler;
    xprofiler.start({
      ...xprofilerConfig,
      log_dir: xtransitConfig.logDir,
      log_interval: xtransitConfig.logInterval || 120,
      check_throw: xtransitConfig.checkThrow || false,
    });
  }

  @LifecycleHook()
  async didReady() {
    const config: XtransitConfig = this.app.config.xtransit;
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
