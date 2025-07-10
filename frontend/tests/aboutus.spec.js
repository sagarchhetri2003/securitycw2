import { test, expect } from '@playwright/test';

test.describe('About Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/about'); // Adjust if your frontend is running on a different port
  });

  test('should render the About Us page correctly', async ({ page }) => {
    // Check if the "About Us" heading is visible
    await expect(page.locator('h1')).toHaveText('About Us');

    // Verify the first paragraph is visible
    await expect(page.locator('p:has-text("Welcome to Afnai Real Estate")')).toBeVisible();

    // Verify all section headers are correctly displayed
    const sectionHeaders = [
      'Fresh Opportunities',
      'Diverse Listings',
      'Simple and Easy Process',
      'Exceptional Service',
      'Join Us Today'
    ];

    for (const header of sectionHeaders) {
      await expect(page.locator(`h2:has-text("${header}")`)).toBeVisible();
    }
  });

  test('should display correct content under each section', async ({ page }) => {
    await expect(page.locator('h2:has-text("Fresh Opportunities") + p')).toContainText('We take pride in sourcing the best properties');
    await expect(page.locator('h2:has-text("Diverse Listings") + p')).toContainText('With a wide range of properties to choose from');
    await expect(page.locator('h2:has-text("Simple and Easy Process") + p')).toContainText('Say goodbye to complicated real estate procedures');
    await expect(page.locator('h2:has-text("Exceptional Service") + p')).toContainText('Your satisfaction is our top priority');
    await expect(page.locator('h2:has-text("Join Us Today") + p')).toContainText('Whether you are looking to buy your first home');
  });
});
