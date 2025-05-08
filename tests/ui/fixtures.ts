import { test as baseTest } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { SecondPage } from '../../pages/SecondPage'; // ודא שהנתיב נכון

export const test = baseTest.extend<{
  homePage: HomePage;
  secondPage: SecondPage;
}>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  secondPage: async ({ page }, use) => {
    await use(new SecondPage(page));
  },
});

export const expect = test.expect;
