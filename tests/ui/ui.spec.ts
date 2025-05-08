import { test, expect } from './fixtures';  // ייבוא מ-fixtures
// @ts-ignore
import { allure } from 'allure-playwright';
import { logger } from '../../Logger';





test('בדיקה מלאה: מעבר לניהול הסקר ואז למסך עונות', async ({ homePage, page,secondPage }) => {
  allure.description("הטסט בודק את מעבר לניהול הסקר ואז למסך עונות.");
  allure.owner("or gilat");
  allure.tags("entry", "development");
  allure.severity('critical');
  await page.goto('https://www.shufersal.co.il/online/he/A');
   logger.info("succes")
   await allure.step(' stage 1', async () => {
    await homePage.checkCartAndExpandIfNeeded();
   await homePage.navigate();
  })
  await allure.step(' stage 2', async () => {
   await homePage.calculate();
  })
  await allure.step('stage 3', async () => {
   await homePage.button();
   
  })
  await allure.step('stage 4', async () => {
    await secondPage.countItems();
    
   })
});
