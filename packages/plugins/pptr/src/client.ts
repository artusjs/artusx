import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';

import puppeteer from 'puppeteer-core';
import type { Browser, PuppeteerLaunchOptions, ConnectOptions } from 'puppeteer-core';

export type PPTRConfig = {
  launch?: PuppeteerLaunchOptions;
  connect?: ConnectOptions;
};

@Injectable({
  id: ArtusXInjectEnum.PPTR,
  scope: ScopeEnum.SINGLETON,
})
export default class PPTRClient {
  private browser: Browser;

  async init(config: PPTRConfig) {
    let browser;

    if (!config.connect && !config.launch) {
      return;
    }

    if (config.connect) {
      browser = await puppeteer.connect(config.connect);
    }

    if (config.launch) {
      browser = await puppeteer.launch(config.launch);
    }

    this.browser = browser;
  }

  getClient(): Browser {
    return this.browser;
  }

  async close() {
    await this.browser.close();
  }
}
