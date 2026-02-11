import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Shopping cart tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await page.goto('https://www.saucedemo.com');
    await loginPage.authorize('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Add one item to the cart', async ({ page }) => {
    //await inventoryPage.addProductToCart('Sauce Labs Onesie');
    //await inventoryPage.clickCart();
    await inventoryPage.addProductToCartSimple('Sauce Labs Onesie');
    await inventoryPage.clickCart();
  });

  test('Get cart badge count after adding items', async ({ page }) => {
    await inventoryPage.addProductToCartSimple('Sauce Labs Backpack');
    await inventoryPage.addProductToCartSimple('Sauce Labs Bike Light');
    const badgeCount = await inventoryPage.getCartBadgeCount();
    await expect(badgeCount).toBe(2);
  });

  //craete test add three items and verify that there are three items in the cart badge
  test('Add three items to the cart and verify cart badge count', async ({ page }) => {
    await inventoryPage.addProductToCartSimple('Sauce Labs Backpack');
    await inventoryPage.addProductToCartSimple('Sauce Labs Bike Light');
    await inventoryPage.addProductToCartSimple('Sauce Labs Onesie');
    const badgeCount = await inventoryPage.getCartBadgeCount();
    await expect(badgeCount).toBe(3);
  });

  test('Item removal from cart', async ({ page }) => {
    await inventoryPage.addProductToCartSimple('Sauce Labs Backpack');
    await inventoryPage.addProductToCartSimple('Sauce Labs Bike Light');
    let badgeCount = await inventoryPage.getCartBadgeCount();
    await expect(badgeCount).toBe(2);

    await inventoryPage.removeProduct('Sauce Labs Backpack');
    badgeCount = await inventoryPage.getCartBadgeCount();
    await expect(badgeCount).toBe(1);
  });
  test('Are all social logos visible', async ({ page }) => {
    await expect(await inventoryPage.areSocialLogosVisible()).toBeTruthy();
  });
});
