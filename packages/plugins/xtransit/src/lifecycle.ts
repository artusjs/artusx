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
    const xtransitConfig: XtransitConfig = this.app.config.xtransit;
    const { server, appId, appSecret } = xtransitConfig;

    assert(
      server && appId && appSecret,
      'xtransit config error, server, appId, appSecret must be passed in.'
    );

    // logger
    let loggerInstance = this.app.logger;

    const log4js: any = this.app.container.get('ARTUSX_LOG4JS', {
      noThrow: true,
    });

    if (log4js) {
      loggerInstance = log4js.getLogger();
    }

    const xtransitLogger = {};
    for (const method of ['info', 'warn', 'error', 'debug']) {
      xtransitLogger[method] = (message, ...args) => {
        loggerInstance[method](`[xtransit] ${message}`, ...args);
      };
    }

    xtransit.start({
      logger: xtransitLogger,
      ...xtransitConfig,
    });
  }
}

export { XtransitConfig, XprofilerConfig };
