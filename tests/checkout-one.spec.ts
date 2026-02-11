import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { YourCartPage } from '../pages/YourCartPage';
import { CheckoutOnePage } from '../pages/CheckoutOnePage';
import { generateTestData } from '../Utilities/Faker';

test.describe('Checkout tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let yourCartPage: YourCartPage;
  let checkoutOnePage: CheckoutOnePage;

  test.beforeEach(async ({ page }) => {
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
    await expect(inventoryPage.areSocialLogosVisible).toBeTruthy();
  });
  test('Fill Checkout Form and click continue', async ({ page }) => {
    const testData = generateTestData();
    await checkoutOnePage.fillCheckoutForm(testData.firstName, testData.lastName, testData.zipCode);
    await checkoutOnePage.clickContButton();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
  });
  test('Leave checkout form empty and press continue', async ({ page }) => {
    await checkoutOnePage.clickContButton();
    await expect(await checkoutOnePage.isErrorMessageDisplayed()).toBeTruthy();
  });

  test('Fill checkout form but leave firstname blank and press cont', async ({ page }) => {
    const testData = generateTestData();
    await checkoutOnePage.fillCheckoutForm('', testData.lastName, testData.zipCode);
    await checkoutOnePage.clickContButton();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    const errorMessage = await page.locator('[data-test="error"]').textContent();
    await expect(errorMessage).toContain('Error: First Name is required');
  });
  test('Fill checkout form but leave lastname blank and press cont', async ({ page }) => {
    const testData = generateTestData();
    await checkoutOnePage.fillCheckoutForm(testData.firstName, '', testData.zipCode);
    await checkoutOnePage.clickContButton();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    const errorMessage = await page.locator('[data-test="error"]').textContent();
    await expect(errorMessage).toContain('Error: Last Name is required');
  });
  test('Fill checkout form but leave zip blank and press cont', async ({ page }) => {
    const testData = generateTestData();
    await checkoutOnePage.fillCheckoutForm(testData.firstName, testData.lastName, '');
    await checkoutOnePage.clickContButton();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    const errorMessage = await page.locator('[data-test="error"]').textContent();
    await expect(errorMessage).toContain('Error: Postal Code is required');
  });
});
