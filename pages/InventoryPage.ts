import { Locator, Page } from '@playwright/test';
export class InventoryPage {
  private readonly page: Page;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly inventoryItems: Locator;
  private readonly facebookLogo: Locator;
  private readonly linkedInLogo: Locator;
  private readonly twitterLogo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.inventoryItems = page.locator('.inventory_item');
    this.facebookLogo = page.locator('[data-test="social-facebook"]');
    this.linkedInLogo = page.locator('[data-test="social-linkedin"]');
    this.twitterLogo = page.locator('[data-test="social-twitter"]');
  }
  async addProductToCart(productName: string): Promise<void> {
    let dataTestId = this.getDataTestId(productName);
    await this.page.locator(`[data-test="add-to-cart-${dataTestId}"]`).click({ timeout: 2000 });
  }
  private getDataTestId(productName: string): string {
    return productName.toLowerCase().replace(/\s/g, '-').replace(/[()]/g, '');
  }
  async clickCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartBadgeCount(): Promise<number> {
    const badgeText = await this.cartBadge.textContent();
    return badgeText ? parseInt(badgeText, 10) : 0;
  }

  async getCartItemCount(): Promise<string> {
    if (await this.cartBadge.isVisible()) {
      return (await this.cartBadge.textContent()) || '0';
    }
    return '0';
  }

  private getProductContainer(productName: string): Locator {
    return this.inventoryItems.filter({ hasText: productName });
  }
  async addProductToCartSimple(productName: string): Promise<void> {
    const product = this.getProductContainer(productName);
    await product.locator('button:has-text("Add to cart")').click();
  }

  async removeProduct(productName: string): Promise<void> {
    const product = this.getProductContainer(productName);
    await product.locator('button:has-text("Remove")').click();
  }
  async areSocialLogosVisible(): Promise<boolean> {
    const facebook = await this.facebookLogo.isVisible();
    const linkedIn = await this.linkedInLogo.isVisible();
    const twitter = await this.twitterLogo.isVisible();
    return facebook && linkedIn && twitter;
  }
}
