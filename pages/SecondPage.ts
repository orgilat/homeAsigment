import { logger } from '../Logger';
import { Page, Locator, expect } from '@playwright/test';

export class SecondPage {
    readonly page: Page;
    readonly step: Locator;
    readonly totalPrice: Locator;
    readonly logo: Locator;
    readonly picture: Locator
    readonly expandCartBtn: Locator;
    readonly faster: Locator;
    readonly one: Locator;
    readonly two: Locator;
    readonly checkbox: Locator;
    readonly alone: Locator;
    readonly compare: Locator;

    constructor(page: Page) {


        this.page = page;
        // מצא את כל הפריטים שמכילים את הקלאס 'miglog-cart-summary-prod-wrp new'
        this.step = page.locator('//div[contains(@class,"miglog-cart-summary-prod-wrp new")]');
        this.totalPrice = page.locator("//span[@class='currency currencyBtnToggle']");
        this.logo = page.locator('(//a[@class="hidden-xs"])[2]');
        this.picture = page.locator('(//img[@aria-label="שוברים שיאים במבצעים בתוקף עד ה 18.5.25 מותנה בקניה מעל 150 ₪ מוגבל ל 3 מימושים או עד גמר המלאי לפחות 1000 יחידות במלאי "])[1]');
        this.expandCartBtn = page.locator('//button[@data-focus="#cartMiddleContent"]');

        this.one = page.getByRole('link', { name: 'icon הרשימות שלי' });
       this.two = page.getByRole('link', { name: 'רשימה שיצרנו עבורך icon ערןך' });
       this.checkbox = page.locator('(//span[@class="checkboxPic"])[1]');
       this.alone = page.locator('(//li[@data-c="categoryIndex_undefined"])');
       this.compare = page.locator('(//span[@class="text"]//span[1])');
      ;

    }

    async countItems() {
        // סופר את כל האלמנטים עם הקלאס הספציפי
        const itemCount = await this.step.count();
        logger.warn(`המספר פריטים עם הקלאס הזה: ${itemCount}`);
        const rawText = await this.totalPrice.innerText();
        logger.info(`💸 הסכום לתשלום כפי שמוצג באתר: ${rawText.trim()}`);
        await this.logo.click();
        await expect(this.picture).toBeVisible({ timeout: 5000 });
        const adText = await this.picture.getAttribute('aria-label');
        logger.info(`📢 טקסט מתוך הפרסומת (aria-label): ${adText}`);
       
        await this.expandCartBtn.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(2500); //
        await this.expandCartBtn.click();

        logger.info("סוגרים")
        await this.one.click()
        logger.info("עברנו ל- רשימות שלי")
        await this.two.click()
        await this.page.waitForTimeout(2500); 
        await this.checkbox.waitFor({ state: 'visible' });
        await this.checkbox.click()
        const counter= await this.alone.count();
        console.log(`המספר פריטים עם הקלאס הזה: ${counter}`)
        const stepingto1=await this.compare.innerText();
        const steping2=parseInt(stepingto1.replace(/[^\d]/g, ''), 10);
        console.log(`המספר פריטים עם להוספה הקלאס הזה: ${steping2}`)
        expect(counter, '❌ מספר הפריטים לאחר ההוספה לא תואם לציפייה')
        .toBe(steping2 + 1);
        

    }
}
