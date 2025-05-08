import { chromium } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // כניסה לאתר שופרסל
  await page.goto('https://www.shufersal.co.il/online/he/A');

  // ניסיון לסגור פרסומת (אם קיימת)
  await page.locator('.dy-lb-close').click().catch(() => {});

  // לחיצה על כפתור "כניסה" - חכה לוודא שהלוקייטור נטען
  try {
    await page.locator('a.linkEnter').waitFor({ state: 'attached', timeout: 30000 });
    await page.locator('a.linkEnter').click();
  } catch (e) {
    console.error('לא נמצא כפתור כניסה:', e);
    await browser.close();
    return;
  }

  // מילוי פרטי התחברות
  await page.fill('#j_username', 'orgilat123@gmail.com');
  await page.fill('#j_password', 'Gilateam1!');

  // לחיצה על כפתור הכניסה - חכה לוודא שהלוקייטור נטען
  try {
    await page.getByRole('button', { name: 'כניסה' }).waitFor({ state: 'attached', timeout: 30000 });
    await page.getByRole('button', { name: 'כניסה' }).click();
  } catch (e) {
    console.error('לא נמצא כפתור כניסה:', e);
    await browser.close();
    return;
  }

  // שמירת סטוראג'
  await context.storageState({ path: 'LoginAuth.json' });
  await browser.close();
}

export default globalSetup;
