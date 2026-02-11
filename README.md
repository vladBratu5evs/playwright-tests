# Playwright E2E Test Suite

A comprehensive end-to-end testing suite for the SauceDemo web application built with Playwright and TypeScript. This project demonstrates modern testing practices using the Page Object Model (POM) pattern for maintainable and scalable test automation.

## 📋 Overview

This project contains automated tests for the [SauceDemo](https://www.saucedemo.com) web application, covering critical user workflows including:

- **Authentication**: Login functionality with valid and invalid credentials
- **Inventory Management**: Browsing and adding products to cart
- **Shopping Cart**: Managing cart items and checkout process
- **Checkout Flow**: Multi-step checkout with shipping and payment information
- **Locators & Assertions**: Comprehensive element selection and validation tests

## 🛠️ Tech Stack

- **Playwright** (`@playwright/test` v1.57.0) - Browser automation framework
- **TypeScript** - Type-safe testing code
- **Faker.js** (`@faker-js/faker`) - Generate realistic test data
- **Node.js** - Runtime environment

## 📁 Project Structure

```
playwright-project/
├── tests/                      # Test specifications
│   ├── authorization.spec.ts   # Authorization/login tests
│   ├── checkout-one.spec.ts    # Checkout step 1 tests
│   ├── checkout-two.spec.ts    # Checkout step 2 tests
│   ├── inventory.spec.ts       # Product inventory tests
│   ├── your-cart.spec.ts       # Shopping cart tests
│   ├── login.spec.ts           # Login workflow tests
│   ├── locator.spec.ts         # Locator strategy tests
│   ├── expectations.spec.ts    # Assertion/expectation tests
│   ├── first-test.spec.ts      # Initial test example
│   └── seed.spec.ts            # Test setup/fixture
├── pages/                      # Page Object Model classes
│   ├── LoginPage.ts            # Login page objects
│   ├── InventoryPage.ts        # Inventory page objects
│   ├── YourCartPage.ts         # Shopping cart page objects
│   ├── CheckoutOnePage.ts      # Checkout page 1 objects
│   ├── CheckoutTwoPage.ts      # Checkout page 2 objects
│   └── CheckoutCompletePage.ts # Order confirmation page objects
├── Utilities/                  # Utility functions
│   └── Faker.ts               # Faker.js functions for test data generation
├── playwright.config.ts        # Playwright configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/vladBratu5evs/playwright-project.git
cd playwright-project
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## 📝 Running Tests

### Run all tests:

```bash
npm test
```

### Run a specific test file:

```bash
npx playwright test tests/login.spec.ts
```

### Run tests in headed mode (see browser):

```bash
npx playwright test --headed
```

### Run tests with UI Mode (interactive debugging):

```bash
npx playwright test --ui
```

### Run tests in a specific browser:

```bash
npx playwright test --project=chromium
```

### Debug a test:

```bash
npx playwright test --debug
```

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## 📚 Key Features

- **Faker.js Integration**: Generate realistic random test data (names, addresses, zip codes)
- **Page Object Model**: Encapsulated page elements and interactions for maintainability
- **TypeScript Support**: Full type safety and IntelliSense support
- **Parallel Execution**: Tests run in parallel for faster feedback
- **Assertions**: Comprehensive expect-based assertions for validation
- **Fixtures & Setup**: BeforeEach hooks for consistent test initialization
- **Multi-Browser Testing**: Support for Chromium, Firefox, and WebKit

## 🔧 Configuration

Edit `playwright.config.ts` to customize:

- Test timeout and retry settings
- Browser types and launch options
- Output directories for reports and artifacts
- Parallel test execution settings

## 📖 Test Examples

### Authentication Test

```typescript
test('Happy path: successful authorization', async ({ page }) => {
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('.title')).toHaveText('Products');
});
```

### Page Object Usage

```typescript
test('Checkout workflow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new YourCartPage(page);

  await page.goto('https://www.saucedemo.com');
  await loginPage.authorize('standard_user', 'secret_sauce');
  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.clickCart();
  await cartPage.clickCheckout();
});
```

### Using Faker.js for Test Data

```typescript
import { generateTestData } from '../Utilities/Faker';

test('Fill Checkout Form with random data', async ({ page }) => {
  // Generate random test data
  const testData = generateTestData();

  // testData contains:
  // - firstName: randomly generated first name
  // - lastName: randomly generated last name
  // - zipCode: randomly generated zip code

  await checkoutOnePage.fillCheckoutForm(
    testData.firstName,
    testData.lastName,
    testData.zipCode
  );
  await checkoutOnePage.clickContButton();
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
});
```

#### Available Faker Functions

```typescript
import { generateTestData } from '../Utilities/Faker';

const data = generateTestData();
// Returns object with: firstName, lastName, zipCode
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch
2. Add tests for new functionality
3. Ensure all tests pass
4. Submit a pull request

## 📄 License

ISC License - see package.json for details

## 👨‍💻 Author

vladBratu5evs

## 🔗 Resources

- [Playwright Documentation](https://playwright.dev)
- [SauceDemo Application](https://www.saucedemo.com)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
