import { test, expect } from '@playwright/test';

test.describe('Home Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001'); // Adjust URL if necessary
  });


  test('should display feature categories correctly', async ({ page }) => {
    const categories = ['Wide Range of Properties', 'Luxury Homes for You', 'Affordable Housing'];

    for (const category of categories) {
      await expect(page.locator(`label:has-text("${category}")`)).toBeVisible();
    }
  });

  test('should display recommended properties', async ({ page }) => {
    await page.waitForTimeout(1000); // Wait for properties to load
    const propertyCards = page.locator('a[role="button"]');
    await expect(propertyCards).toHaveCount(8); // Adjust based on how many properties should load
  });

  test('should navigate to property page when clicking "See Our Listings"', async ({ page }) => {
    await page.click('a:has-text("See Our Listings")');
    await expect(page).toHaveURL(/.*property/);
  });

  test('should open and close wishlist modal', async ({ page }) => {
    const wishlistButton = page.locator('.fixed.bottom-10.right-10'); // Wishlist heart icon button
    await wishlistButton.click();

    // Check if wishlist modal appears
    await expect(page.locator('h2:has-text("Your Wishlist")')).toBeVisible();

    // Close modal
    await page.click('button:has-text("Close")');
    await expect(page.locator('h2:has-text("Your Wishlist")')).not.toBeVisible();
  });

  test('should display testimonials section', async ({ page }) => {
    await expect(page.locator('blockquote:has-text("As a homebuyer, I found my dream property")')).toBeVisible();
  });

  test('should display CTA section with "See More" button', async ({ page }) => {
    await expect(page.locator('p:has-text("Your Ideal Home,")')).toBeVisible();
    await expect(page.locator('button:has-text("See More")')).toBeVisible();
  });

  test('should navigate to property page when clicking "See More" CTA button', async ({ page }) => {
    await page.click('button:has-text("See More")');
    await expect(page).toHaveURL(/.*property/);
  });
});
