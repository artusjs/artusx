import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { VanillaPuppeteer } from 'puppeteer-extra';
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

    puppeteer.use(StealthPlugin());

    if (config.connect) {
      browser = await puppeteer.connect(config.connect as Parameters<VanillaPuppeteer['connect']>[0]);
    }

    if (config.launch) {
      browser = await puppeteer.launch(config.launch as Parameters<VanillaPuppeteer['launch']>[0]);
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
