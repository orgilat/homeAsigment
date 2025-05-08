import { logger } from '../Logger';
import { Page, Locator, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

export class HomePage {
  readonly page: Page;
  readonly step: Locator;
  readonly step2: Locator;
  readonly confirm: Locator;
  readonly allInputs: Locator;
  readonly minusc: Locator;
  readonly sal: Locator;
  readonly cartCount: Locator;
  readonly expandCartBtn: Locator;
  readonly expandCartBtn2: Locator;
  readonly expandCartBtn3: Locator;

  constructor(page: Page) {
    this.page = page;
    this.step = page.locator('(//div[@class="left"]//span)[2]');
    this.step2 = page.locator('#message_27');
    this.confirm = page.locator('//span[normalize-space(text())="צרו לי רשימה"]');
    this.allInputs = page.locator('//input[@max="100"]');
    this.minusc = page.locator('text="כמות המינימלית בקניה 1 יח\'"');
    this.sal = page.locator('//button[contains(@class,"result-btn btn-sticky")]');

    this.cartCount = page.locator('//span[@class="number miglog-regular"]');
    this.expandCartBtn = page.locator('//button[@data-focus="#cartMiddleContent"]');
    this.expandCartBtn2 = page.getByRole('button', { name: 'ניקוי הסל' });
    this.expandCartBtn3 = page.getByRole('button', { name: ' כן, רוקנו את הסל' });
  }

  private async searchAndEnter(product: string) {
    logger.info(`⌨️ מחפש מוצר: ${product}`);
    await this.step2.waitFor({ state: 'visible', timeout: 10000 });
    await this.step2.fill(product);
    await this.step2.press('Enter');
  }

  async checkCartAndExpandIfNeeded() {
    logger.info('🔍 בודק את הסל...');
    const countElements = await this.cartCount.count();
    if (countElements === 0) {
      logger.warn('⚠️ cartCount לא נמצא - מדלג על ניקוי הסל');
      return;
    }

    let countText = '0';
    try {
      countText = await this.cartCount.innerText();
    } catch (e) {
      logger.warn('⚠️ שגיאה בקריאת cartCount, מניחים 0');
    }

    const numericCount = parseInt(countText.replace(/[^\d]/g, ''), 10) || 0;
    logger.info(`🛒 מספר פריטים בסל: ${numericCount}`);
    allure.attachment('Cart Item Count', `${numericCount}`, 'text/plain');

    if (numericCount > 0) {
      try {
        await this.expandCartBtn.click({ timeout: 5000 });
        await this.expandCartBtn2.click({ timeout: 5000 });
        await this.expandCartBtn3.click({ timeout: 5000 });
        logger.info('🧹 הסל נוקה');
      } catch (e) {
        logger.error('❌ שגיאה בניקוי הסל', e);
      }
    }
  }

  async navigate() {
    logger.info('🚀 מתחיל ניווט');

    await this.page.waitForLoadState('domcontentloaded');

    await expect(this.step).toBeVisible({ timeout: 30000 });
    await this.step.click();

    await expect(this.step2).toBeVisible({ timeout: 30000 });
    await this.step2.click();

    for (const product of ['גבינה', 'ביצים', 'חלב']) {
      await this.searchAndEnter(product);
    }

    await expect(this.confirm).toBeVisible({ timeout: 30000 });
    await this.confirm.click();
    logger.info('✅ סיום שלב הניווט');
  }

  async calculate() {
    logger.info('🧮 מתחיל חישוב כמות');
    const firstInput = this.allInputs.first();
    await expect(firstInput).toBeVisible({ timeout: 30000 });
    await firstInput.focus();
    await firstInput.press('ArrowUp');

    const count = await this.allInputs.count();
    logger.info(`🔢 כמות שדות קלט: ${count}`);

    for (let i = 0; i < count; i++) {
      const input = this.allInputs.nth(i);
      await input.waitFor({ state: 'visible', timeout: 10000 });
      const value = await input.inputValue();
      if (value !== '1') {
        logger.warn(`⚠️ שדה ${i + 1} - ערך לא צפוי: ${value}`);
      }
    }
  }

  async button() {
    logger.info('📉 בודק לחצן חץ למטה בשדה שלישי');
    const second = this.allInputs.nth(2);
    await expect(second).toBeVisible({ timeout: 30000 });
    await second.focus();
    await second.press('ArrowDown');

    const value = await second.inputValue();
    logger.info(`ערך אחרי שינוי: ${value}`);
    expect(value).toBe('1');

    await expect(this.minusc).toBeVisible({ timeout: 30000 });
    const tooltipText = await this.minusc.innerText();
    logger.info(`📝 טקסט מהטולטיפ: ${tooltipText}`);

    const buffer = await this.minusc.screenshot();
    allure.attachment('Tooltip Screenshot', buffer, 'image/png');

    await expect(this.sal).toBeVisible({ timeout: 30000 });
    await this.sal.scrollIntoViewIfNeeded();
    await this.sal.click();
  }
}
