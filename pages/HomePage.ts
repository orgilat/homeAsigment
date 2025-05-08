import { logger } from '../Logger';
import { Page, Locator, expect } from '@playwright/test';
import { allure } from 'allure-playwright';

export class HomePage {
    readonly page: Page;
    readonly step: Locator;
    readonly step2: Locator;
    readonly confirm: Locator;
    readonly allInputs: Locator;
    readonly plusButton: Locator;
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
        this.expandCartBtn2 =page.getByRole('button', { name: 'ניקוי הסל' })
        this.expandCartBtn3 =page.getByRole('button', { name: ' כן, רוקנו את הסל' })
       
    }

    private async searchAndEnter(product: string) {
        await this.step2.type(product);
        await this.step2.press("Enter");
        logger.info(`הוזן מוצר: ${product}`);
    }

    async checkCartAndExpandIfNeeded() {
        await this.cartCount.waitFor({ state: 'visible', timeout: 30000 });
        const countText = await this.cartCount.innerText();
        const numericCount = parseInt(countText.replace(/[^\d]/g, ''), 10);
    
        logger.info(`🛒 מספר פריטים בסל בתחילת הבדיקה: ${numericCount}`);
        allure.attachment('Cart Item Count', `${numericCount}`, 'text/plain');
    
        if (numericCount > 0) {
            logger.info("📦 הסל לא ריק - מבצע לחיצה לפתיחת הסל");
            await this.expandCartBtn.waitFor({ state: 'visible', timeout: 30000 });
            await this.expandCartBtn.click();
    
            await this.expandCartBtn2.waitFor({ state: 'visible', timeout: 30000 });
            await this.expandCartBtn2.click();
    
            await this.expandCartBtn3.waitFor({ state: 'visible', timeout: 30000 });
            await this.expandCartBtn3.click();
    
            await this.expandCartBtn.waitFor({ state: 'visible', timeout: 30000 });
            await this.expandCartBtn.click();
        } else {
            logger.info("✅ הסל ריק - ממשיכים ללא פתיחה");
        }
    }
    
    async navigate() {
        await expect(this.step).toBeVisible({ timeout: 30000 });
        await this.step.click();
    
        await expect(this.step2).toBeVisible({ timeout: 30000 });
        await this.step2.click();
    
        const products = ["גבינה", "ביצים", "חלב"];
        for (const product of products) {
            await this.searchAndEnter(product);
        }
    
        await this.confirm.waitFor({ state: 'visible', timeout: 30000 });
        await this.confirm.click();
        logger.info("לחצנו לאישור");
    }
    
    async calculate() {
        const firstInput = this.allInputs.first();
        await expect(firstInput).toBeVisible({ timeout: 30000 });
        await firstInput.focus();
        await firstInput.press('ArrowUp');
        logger.info("בוצעה לחיצה על חץ למעלה בשדה הקלט הראשון");
    
        const count = await this.allInputs.count();
        logger.info(`נמצאו ${count} שדות קלט`);
    
        let wrongIndex = -1;
        let wrongValue = "";
    
        for (let i = 0; i < count; i++) {
            const input = this.allInputs.nth(i);
            await input.waitFor({ state: 'visible', timeout: 30000 });
            const value = await input.inputValue();
            if (value !== "1") {
                wrongIndex = i + 1;
                wrongValue = value;
            }
        }
    
        if (wrongIndex !== -1) {
            logger.warn(`⚠️ שדה ${wrongIndex} - ערך חריג: ${wrongValue}`);
        }
    }
    
    async button() {
        const second = this.allInputs.nth(2);
        await expect(second).toBeVisible({ timeout: 30000 });
        await second.focus();
        await second.press('ArrowDown');
    
        const value = await second.inputValue();
        logger.warn(` - ערך האיבר אחרי השינוי: ${value}`);
        expect(value).toBe("1");
    
        await expect(this.minusc).toBeVisible({ timeout: 30000 });
        const tooltipText = await this.minusc.innerText();
        logger.info(`טקסט מהטולטיפ: ${tooltipText}`);
    
        const buffer = await this.minusc.screenshot();
        allure.attachment('Tooltip Screenshot', buffer, 'image/png');
    
        await this.sal.waitFor({ state: 'visible', timeout: 30000 });
        await this.sal.scrollIntoViewIfNeeded();
        await this.sal.click();
    }
  }  