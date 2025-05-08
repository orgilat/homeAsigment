import { logger } from '../Logger';
import { Page, Locator, expect } from '@playwright/test';

export class SecondPage {
    readonly page: Page;
    readonly step: Locator;
    readonly totalPrice: Locator;
    readonly logo: Locator;
    readonly picture: Locator;
    readonly expandCartBtn: Locator;
    readonly one: Locator;
    readonly two: Locator;
    readonly checkbox: Locator;
    readonly alone: Locator;
    readonly compare: Locator;

    constructor(page: Page) {
        this.page = page;
        this.step = page.locator('//div[contains(@class,"miglog-cart-summary-prod-wrp new")]');
        this.totalPrice = page.locator("//span[@class='currency currencyBtnToggle']");
        this.logo = page.locator('(//a[@class="hidden-xs"])[2]');
        this.picture = page.locator('(//img[@aria-label*="שוברים שיאים"])[1]');
        this.expandCartBtn = page.locator('//button[@data-focus="#cartMiddleContent"]');
        this.one = page.getByRole('link', { name: 'icon הרשימות שלי' });
        this.two = page.getByRole('link', { name: 'רשימה שיצרנו עבורך icon ערןך' });
        this.checkbox = page.locator('(//span[@class="checkboxPic"])[1]');
        this.alone = page.locator('(//li[@data-c="categoryIndex_undefined"])');
        this.compare = page.locator('(//span[@class="text"]//span[1])');
    }

    async countItems() {
        await this.page.waitForLoadState('networkidle');

        const itemCount = await this.step.count();
        logger.warn(`🧾 מספר פריטים עם הקלאס הזה: ${itemCount}`);

        const rawText = await this.totalPrice.innerText();
        logger.info(`💸 הסכום לתשלום כפי שמוצג באתר: ${rawText.trim()}`);

        // מעבר ללוגו ופרסומת
        await this.logo.click();
        await this.page.waitForLoadState('networkidle');

        await expect(this.picture).toBeVisible({ timeout: 7000 });
        const adText = await this.picture.getAttribute('aria-label');
        logger.info(`📢 טקסט מתוך הפרסומת (aria-label): ${adText}`);

        // פתיחת סל
        await expect(this.expandCartBtn).toBeVisible({ timeout: 7000 });
        await this.page.waitForTimeout(1000);
        await this.expandCartBtn.click();
        logger.info("📂 פתחנו את הסל");

        // ניווט לרשימות
        await this.page.waitForLoadState('networkidle');
        await this.one.click();
        logger.info("📁 עברנו ל־'הרשימות שלי'");
        await this.page.waitForLoadState('networkidle');
        await this.two.click();

        // סימון צ'קבוקס
        await this.page.waitForTimeout(2000);
        await expect(this.checkbox).toBeVisible({ timeout: 5000 });
        await this.checkbox.click();
        await this.page.waitForLoadState('networkidle');

        // בדיקת כמות
        const counter = await this.alone.count();
        logger.warn(`🔢 כמות פריטים בפועל בעמוד: ${counter}`);

        const compareText = await this.compare.innerText();
        const expectedCount = parseInt(compareText.replace(/[^\d]/g, ''), 10);
        logger.warn(`🧮 מספר צפוי לפי אזור ההשוואה: ${expectedCount}`);

        expect(counter, '❌ מספר הפריטים לאחר ההוספה לא תואם לציפייה').toBe(expectedCount + 1);
    }
}
