import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { YourCartPage } from '../pages/YourCartPage';
import { CheckoutOnePage } from '../pages/CheckoutOnePage';
import { CheckoutTwoPage } from '../pages/CheckoutTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

test.describe('Checkout Complete tests', () => {
  let checkoutCompletePage: CheckoutCompletePage;
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let yourCartPage: YourCartPage;
  let checkoutOnePage: CheckoutOnePage;
  let checkoutTwoPage: CheckoutTwoPage;

  test.beforeEach(async ({ page }) => {
    checkoutCompletePage = new CheckoutCompletePage(page);
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    yourCartPage = new YourCartPage(page);
    checkoutOnePage = new CheckoutOnePage(page);
    checkoutTwoPage = new CheckoutTwoPage(page);

    await page.goto('https://www.saucedemo.com');
    await loginPage.authorize('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await inventoryPage.addProductToCartSimple('Sauce Labs Onesie');
    await inventoryPage.addProductToCartSimple('Sauce Labs Fleece Jacket');
    await inventoryPage.clickCart();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await yourCartPage.clickCheckout();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
    const badgeCount = await yourCartPage.getCartBadgeCount();
    await expect(badgeCount).toBe(2);
    await checkoutOnePage.fillCheckoutForm('Vlad', 'Bratusevs', '12345');
    await checkoutOnePage.clickContButton();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
    await checkoutTwoPage.clickFinishButton();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(await inventoryPage.areSocialLogosVisible()).toBeTruthy();
  });

  test('Verify that "Thank you for your order!" message is displayed', async ({ page }) => {
    const isThankYouMessageVisible = await checkoutCompletePage.isThankYouMessageVisible();
    expect(isThankYouMessageVisible).toBeTruthy();
  });

  test('Verify that Back Home button works correctly from Checkout Complete page', async ({
    page,
  }) => {
    await checkoutCompletePage.clickBackHome();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});
