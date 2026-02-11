import { Locator, Page } from '@playwright/test';
export class LoginPage {
  // Define locators for the LoginPage
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly closeButton: Locator;

  private readonly page: Page;

  constructor(page: Page) {
    // Initialize locators
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.closeButton = page.locator('[data-test="error-button"]');

    this.page = page;
  }

  // Create function for each element;
  // Combine authorization steps;

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async authorize(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    const errorText = await this.errorMessage.textContent();
    return errorText || '';
  }

  async isErrorDisplayed(): Promise<boolean> {
    const isVisible = await this.errorMessage.isVisible();
    return isVisible;
  }

  async isErrorHidden(): Promise<boolean> {
    const isHidden = await this.errorMessage.isHidden();
    return isHidden;
  }

  async isOnLoginPage(): Promise<boolean> {
    const currentUrl = await this.page.url();
    const isOnPage = currentUrl.includes('https://www.saucedemo.com');
    return isOnPage;
  }

  async closeErrorMessage(): Promise<void> {
    await this.closeButton.click();
  }
}
