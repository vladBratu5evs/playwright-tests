import { Locator, Page } from '@playwright/test';
export class CheckoutCompletePage {
  private readonly page: Page;
  private backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }
  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
  async isThankYouMessageVisible(): Promise<boolean> {
    const thankYouMessage = this.page.locator('.complete-header');
    return await thankYouMessage.isVisible();
  }
}
