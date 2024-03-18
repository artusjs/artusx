import fs from 'fs';
import path from 'path';
import assert from 'assert';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import { executablePath } from 'puppeteer';

describe('test/pptr.test.ts', () => {
  it('it should return content', async () => {
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.connect({
      browserWSEndpoint: 'ws://browserless:3000',
    });

    // const browser = await puppeteer.launch({
    //   headless: false,
    //   executablePath: executablePath(),
    // });

    const page = await browser.newPage();
    await page.emulate({
      viewport: {
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      },
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    });
    await page.goto('https://rili.jin10.com/', { waitUntil: 'domcontentloaded' });

    const thumb = path.resolve(__dirname, 'jinshi.png');

    await page.screenshot({
      path: thumb,
      encoding: 'binary',
      type: 'jpeg',
      quality: 100,
      fullPage: true,
    });

    await browser.close();

    assert(fs.existsSync(thumb));
    fs.unlinkSync(thumb);
  });
});
