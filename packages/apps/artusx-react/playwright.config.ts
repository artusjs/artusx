import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: 'test-results',

  // reporter: 'html',
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/test-results.json' }],
  ],

  // path to the global setup files.
  // globalSetup: require.resolve('./global-setup'),

  // path to the global teardown files.
  // globalTeardown: require.resolve('./global-teardown'),

  // Each test is given 30 seconds.
  timeout: 30000,
  // use: {
  //   headless: false,
  //    viewport: { width: 1280, height: 720 },
  //    ignoreHTTPSErrors: true,
  //    video: 'on-first-retry',
  //  },
});
