import { chromium } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // כניסה לאתר שופרסל
  await page.goto('https://www.shufersal.co.il/online/he/A');

  // ניסיון לסגור פרסומת (אם קיימת)
  await page.locator('.dy-lb-close').click().catch(() => {});

  // לחיצה על כפתור "כניסה"
  await page.locator('a.linkEnter').click();

  // מילוי פרטי התחברות
  await page.fill('#j_username', 'orgilat123@gmail.com');
  await page.fill('#j_password', 'Gilateam1!');

  // לחיצה על כפתור הכניסה
  await page.getByRole('button', { name: 'כניסה' }).click();

  // שמירת סטוראג'
  await context.storageState({ path: 'LoginAuth.json' });
  await browser.close();
}

export default globalSetup;
