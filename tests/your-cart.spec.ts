import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { YourCartPage } from '../pages/YourCartPage';

test.describe('Your cart tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let yourCartPage: YourCartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    yourCartPage = new YourCartPage(page);

    await page.goto('https://www.saucedemo.com');
    await loginPage.authorize('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await inventoryPage.addProductToCartSimple('Sauce Labs Onesie');
    await inventoryPage.addProductToCartSimple('Sauce Labs Fleece Jacket');
    await inventoryPage.clickCart();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  });

  test('Click checkout and go to checkout page', async ({ page }) => {
    await yourCartPage.clickCheckout();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
  });

  test('Click Continue shopping and page should return to Inventory page', async ({ page }) => {
    await yourCartPage.clickContShopping();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Remove 1 item from cart', async ({ page }) => {
    await yourCartPage.removeProductFromCart('Sauce Labs Onesie');
    const badgeCount = await yourCartPage.getCartBadgeCount();
    await expect(badgeCount).toBe(1);
  });
  test('Remove all items from cart', async ({ page }) => {
    await yourCartPage.removeProductFromCart('Sauce Labs Onesie');
    await yourCartPage.removeProductFromCart('Sauce Labs Fleece Jacket');
  });

  test('Get cart badge count after items were added', async ({ page }) => {
    const badgeCount = await yourCartPage.getCartBadgeCount();
    await expect(badgeCount).toBe(2);
  });
  test('Remove all items from cart and no cart badge is visible', async ({ page }) => {
    await yourCartPage.removeProductFromCart('Sauce Labs Onesie');
    await yourCartPage.removeProductFromCart('Sauce Labs Fleece Jacket');
    await expect(yourCartPage.isCartBadgeHidden).toBeTruthy();
  });
  test('Are all social logos visible', async ({ page }) => {
    await expect(await yourCartPage.areSocialLogosVisible()).toBeTruthy();
  });
});
