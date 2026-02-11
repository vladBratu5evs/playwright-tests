import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authorization suite', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('https://www.saucedemo.com');
  });

  test('Success login', async () => {
    await loginPage.authorize('standard_user', 'secret_sauce');
  });

  test('Unhappy path: failed authorization', async ({ page }) => {
    await loginPage.authorize('test', 'test');

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(
      'Epic sadface: Username and password do not match any user in this service'
    );

    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBeTruthy();

    const isOnLoginPage = await loginPage.isOnLoginPage();
    expect(isOnLoginPage).toBeTruthy();
  });

  test('Invalid credentials: wrong username and correct password', async () => {
    await loginPage.authorize('test', 'secret_sauce');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('Invalid credentials: wrong password and correct username', async () => {
    await loginPage.authorize('standard_user', 'test');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('Invalid credentials: fields are empty', async () => {
    await loginPage.authorize('', '');
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface: Username is required');
  });

  test('Validate that user can close error message', async () => {
    await loginPage.authorize('', '');
    const errorMessage = await loginPage.getErrorMessage();
    const isErrorDisplayed = await loginPage.isErrorDisplayed();
    expect(isErrorDisplayed).toBeTruthy();
    await loginPage.closeErrorMessage();
    const isErrorHidden = await loginPage.isErrorHidden();
    expect(isErrorHidden).toBeTruthy();
  });
});
