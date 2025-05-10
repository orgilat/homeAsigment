import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 280 * 1000,
  use: {
    headless: false,
    storageState: 'LoginAuth.json',  // שימוש ב-cookies ששמרנו ב-global-setup
    screenshot: 'only-on-failure',
    video: { mode: 'on', size: { width: 1281, height: 720 } },
    viewport: { width: 1280, height: 720 },
    baseURL:  'https://www.shufersal.co.il/online/he/A',
    ignoreHTTPSErrors: true,
  },
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  globalSetup: require.resolve('./global-setup'), // הפנייה ל-global-setup.ts
});
