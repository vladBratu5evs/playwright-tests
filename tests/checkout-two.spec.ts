import { test, expect } from '@playwright/test';
import { CheckoutTwoPage } from '../pages/CheckoutTwoPage';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { YourCartPage } from '../pages/YourCartPage';
import { CheckoutOnePage } from '../pages/CheckoutOnePage';

test.describe('Checkout tests', () => {
  let checkoutTwoPage: CheckoutTwoPage;
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let yourCartPage: YourCartPage;
  let checkoutOnePage: CheckoutOnePage;

  test.beforeEach(async ({ page }) => {
    checkoutTwoPage = new CheckoutTwoPage(page);
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    yourCartPage = new YourCartPage(page);
    checkoutOnePage = new CheckoutOnePage(page);

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
    await expect(await inventoryPage.areSocialLogosVisible()).toBeTruthy();
  });

  test('Verify the Total amount is correct', async ({ page }) => {
    const expectedTotal = await checkoutTwoPage.expectedTotal();
    const actualTotal = await checkoutTwoPage.getTotalAmount();
    expect(actualTotal).toBe(expectedTotal);
  });

  test('Click Finish to complete the purchase', async ({ page }) => {
    await checkoutTwoPage.clickFinishButton();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
  });

  test("Check the cart's badge count icon dissappears after the purchase is complete", async ({
    page,
  }) => {
    await checkoutTwoPage.clickFinishButton();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
    await expect(await yourCartPage.isCartBadgeHidden()).toBeTruthy();
  });

  test('Verify Back Home button works correctly', async ({ page }) => {
    await checkoutTwoPage.clickCancelButton();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});
