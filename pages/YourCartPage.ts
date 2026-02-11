import { Locator, Page } from '@playwright/test';
export class YourCartPage {
  private readonly page: Page;
  private readonly checkoutButton: Locator;
  private readonly continueShopping: Locator;
  private readonly cartBadge: Locator;
  private readonly facebookLogo: Locator;
  private readonly linkedInLogo: Locator;
  private readonly twitterLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShopping = page.locator('[data-test="continue-shopping"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.facebookLogo = page.locator('[data-test="social-facebook"]');
    this.linkedInLogo = page.locator('[data-test="social-linkedin"]');
    this.twitterLogo = page.locator('[data-test="social-twitter"]');
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
  async clickContShopping(): Promise<void> {
    await this.continueShopping.click();
  }
  private getDataTestId(productName: string): string {
    return productName.toLowerCase().replace(/\s/g, '-').replace(/[()]/g, '');
  }
  async removeProductFromCart(productName: string): Promise<void> {
    let dataTestId = this.getDataTestId(productName);
    await this.page.locator(`[data-test="remove-${dataTestId}"]`).click();
  }
  async getCartBadgeCount(): Promise<number> {
    const badgeText = await this.cartBadge.textContent();
    return badgeText ? parseInt(badgeText, 10) : 0;
  }
  async isCartBadgeHidden(): Promise<boolean> {
    const badgeText = await this.cartBadge.isHidden();
    return badgeText;
  }
  async areSocialLogosVisible(): Promise<boolean> {
    const facebook = await this.facebookLogo.isVisible();
    const linkedIn = await this.linkedInLogo.isVisible();
    const twitter = await this.twitterLogo.isVisible();
    return facebook && linkedIn && twitter;
  }
}
