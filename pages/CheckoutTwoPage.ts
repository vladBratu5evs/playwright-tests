import { Locator, Page } from '@playwright/test';
export class CheckoutTwoPage {
  private readonly page: Page;
  private readonly cancelButton: Locator;
  private readonly finishButton: Locator;
  private readonly subTotal: Locator;
  private readonly tax: Locator;
  private readonly total: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.subTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
  }
  async clickFinishButton(): Promise<void> {
    await this.finishButton.click();
  }
  async clickCancelButton(): Promise<void> {
    await this.cancelButton.click();
  }
  async getTotalAmount(): Promise<number> {
    const totalText = await this.total.textContent();
    const totalAmount = parseFloat(totalText!.replace('Total: $', ''));
    return totalAmount;
  }
  async getSubTotalAmount(): Promise<number> {
    const subTotalText = await this.subTotal.textContent();
    const subTotalAmount = parseFloat(subTotalText!.replace('Item total: $', ''));
    return subTotalAmount;
  }
  async getTaxAmount(): Promise<number> {
    const taxText = await this.tax.textContent();
    const taxAmount = parseFloat(taxText!.replace('Tax: $', ''));
    return taxAmount;
  }
  async expectedTotal(): Promise<number> {
    const subTotal = await this.getSubTotalAmount();
    const tax = await this.getTaxAmount();
    return parseFloat((subTotal + tax).toFixed(2));
  }
}
