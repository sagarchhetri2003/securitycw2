import { test, expect } from '@playwright/test';

test.describe('Header Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001'); // Adjust if necessary
  });

  test('should display logo and navigation links', async ({ page }) => {
    await expect(page.locator('img[alt="applogo"]')).toBeVisible();
    
    const navLinks = ['Home', 'Property', 'About Us'];
    for (const link of navLinks) {
      await expect(page.locator(`div[role="button"]:has-text("${link}")`)).toBeVisible();
    }
  });

  test('should navigate to correct pages on nav click', async ({ page }) => {
    const navLinks = {
      'Home': '/',
      'Property': '/property',
      'About Us': '/about'
    };

    for (const [name, path] of Object.entries(navLinks)) {
      await page.click(`div[role="button"]:has-text("${name}")`);
      await expect(page).toHaveURL(`http://localhost:3001${path}`);
    }
  });

  test('should perform a search and navigate to property page', async ({ page }) => {
    await page.fill('input[type="search"]', 'Luxury Homes');
    await page.click('button:has-text("Search")');

    await expect(page).toHaveURL(/.*property/);
  });



 


});
