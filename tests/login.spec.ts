import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('Authorization on saucedemo.com without POM', () => {
  let inventoryPage: InventoryPage;
  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('https://www.saucedemo.com');
  });

  test('Happy path: successful authorization', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    //Assertions
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    await expect(page).toHaveURL(/.*inventory.html/);

    await expect(page.locator('.title')).toHaveText('Products');

    await expect(page.locator('.inventory_container')).toBeVisible();
  });

  test('Unhappy path: failed authorization', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secretsauce123');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('.error-message-container')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await expect(page).toHaveURL('https://www.saucedemo.com');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Close error message and verify if it dissapeared', async ({ page }) => {
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();

    const errorButton = page.locator('[data-test="error-button"]');
    await expect(errorButton).toBeVisible();
    await errorButton.click();
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });

  test('Verify password field has type = password and placeholder', async ({ page }) => {
    const passwordInput = page.locator('[data-test="password"]');
    await expect(passwordInput).toHaveAttribute('placeholder', 'Password');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('Verify, login button is enabled & contains text Login', async ({ page }) => {
    await expect(page.locator('[data-test="login-button"]')).toBeEnabled();
    await expect(page.locator('[data-test="login-button"]')).toHaveText('Login');
  });
  test('Are all social logos visible', async ({ page }) => {
    await expect(await inventoryPage.areSocialLogosVisible()).toBeFalsy();
  });
});
