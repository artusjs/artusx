import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PuppeteerExtra, VanillaPuppeteer } from 'puppeteer-extra';
import type { Browser, PuppeteerLaunchOptions, ConnectOptions } from 'puppeteer-core';

export type PPTRConfig = {
  launch?: PuppeteerLaunchOptions;
  connect?: ConnectOptions;
};

export { KnownDevices } from 'puppeteer-core';

@Injectable({
  id: ArtusXInjectEnum.PPTR,
  scope: ScopeEnum.SINGLETON,
})
export default class PPTRClient {
  config: PPTRConfig = {};
  puppeteer: PuppeteerExtra;

  constructor() {
    puppeteer.use(StealthPlugin());
    this.puppeteer = puppeteer;
  }

  async init(config: PPTRConfig) {
    if (!config.connect && !config.launch) {
      return;
    }

    this.config = config;
  }

  async getClient() {
    return this.puppeteer;
  }

  async getBrowser(): Promise<Browser> {
    let browser;

    const { connect, launch } = this.config;

    if (connect) {
      browser = (await puppeteer.connect(
        connect as Parameters<VanillaPuppeteer['connect']>[0]
      )) as unknown as Browser;
    }

    if (launch) {
      browser = (await puppeteer.launch(
        launch as Parameters<VanillaPuppeteer['launch']>[0]
      )) as unknown as Browser;
    }

    setTimeout(() => {
      browser.close();
    }, 30000);

    return browser;
  }
}
