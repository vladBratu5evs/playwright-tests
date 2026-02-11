import { Locator, Page } from '@playwright/test';
import { generateTestData } from '../Utilities/Faker';
export class CheckoutOnePage {
  private readonly page: Page;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly zipCode: Locator;
  private readonly contButton: Locator;
  private readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.zipCode = page.locator('[data-test="postalCode"]');
    this.contButton = page.locator('[data-test="continue"]');
    this.error = page.locator('[data-test="error-button"]');
  }

  async fillCheckoutForm(firstname: string, lastname: string, zipcode: string): Promise<void> {
    await this.fillName(firstname);
    await this.fillLastName(lastname);
    await this.fillZip(zipcode);
  }
  async fillName(firstname: string): Promise<void> {
    await this.firstName.fill(firstname);
  }
  async fillLastName(lastname: string): Promise<void> {
    await this.lastName.fill(lastname);
  }
  async fillZip(zipcode: string): Promise<void> {
    await this.zipCode.fill(zipcode);
  }
  async clickContButton(): Promise<void> {
    await this.contButton.click();
  }
  async isErrorMessageDisplayed(): Promise<boolean> {
    const error = await this.error.isVisible();
    return error;
  }
  async getErrorMessage(): Promise<string> {
    const errorText = await this.error.textContent();
    return errorText || '';
  }
}
