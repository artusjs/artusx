import { test, expect, type Page } from '@playwright/test';

const targetUrl = 'http://localhost:5173/';

test.describe.configure({ mode: 'serial' });

test.describe('/', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page?.close();
  });

  test('open the home page', async () => {
    await page.goto(targetUrl);
  });

  test('increase counter', async () => {
    await page.getByRole('button', { name: /count/i }).click();
  });

  test('find learn more text', async () => {
    await expect(
      page.getByText('Click on the Vite and React logos to learn more', { exact: false })
    ).toBeVisible();
  });
});
