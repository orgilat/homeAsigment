import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';

async function globalSetup(config: FullConfig) {
  const loginAuth = process.env.LOGINAUTH;
  if (!loginAuth) {
    throw new Error('Missing LOGINAUTH secret – בדקו שב־GitHub Repo Secrets יש את הערך LOGINAUTH');
  }

  // פותח Chromium ושומר state לקובץ
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // כניסה לאתר
  await page.goto(process.env.BASE_URL ?? 'https://www.shufersal.co.il/online/he/A');

  // ניסיון לסגור פרסומת
  await page.locator('.dy-lb-close').click().catch(() => {});

  // כניסה עם אימייל וסיסמה
  await page.locator('a.linkEnter').waitFor({ state: 'visible', timeout: 30000 });
  await page.locator('a.linkEnter').click();
  await page.fill('#j_username', 'orgilat123@gmail.com');
  await page.fill('#j_password', 'Gilateam1!');
  await page.getByRole('button', { name: 'כניסה' }).waitFor({ state: 'visible', timeout: 30000 });
  await page.getByRole('button', { name: 'כניסה' }).click();

  // שמירת ה־storageState
  await context.storageState({ path: 'LoginAuth.json' });
  await browser.close();
}

export default globalSetup;
