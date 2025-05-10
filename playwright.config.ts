import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ui',                   // תיקיית הבדיקות שלך
  timeout: 280 * 1000,
  retries: 1,
  use: {
    headless: true,                        // להריץ בלי UI על ה-runner
    storageState: 'LoginAuth.json',        // הקובץ ש־global-setup שומר
    screenshot: 'only-on-failure',
    video: { mode: 'retain-on-failure', size: { width: 1280, height: 720 } },
    baseURL: process.env.BASE_URL ?? 'https://www.shufersal.co.il/online/he/A',
    ignoreHTTPSErrors: true,
    ...devices['Desktop Chrome'],          // שימוש בפרופיל Chrome
  },
  reporter: [
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  globalSetup: require.resolve('./global-setup'),  // מפנה ל־global-setup.ts בשורש
});
