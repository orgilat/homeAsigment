import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  use: {
    headless: true,
    storageState: 'LoginAuth.json',
    screenshot: 'only-on-failure',
    video: { mode: 'on', size: { width: 1281, height: 720 } },
    viewport: { width: 1280, height: 720 },
    baseURL: 'https://staging.shufersal.co.il',
    ignoreHTTPSErrors: true,
  },
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
});
