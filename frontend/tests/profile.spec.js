import { test, expect } from '@playwright/test';

test.describe('Profile Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/profile'); // Adjust URL if necessary
  });



  test('should navigate to property page when clicking "Explore Items"', async ({ page }) => {
    const exploreButton = page.locator('a:has-text("Explore Items")');
    
    if (await exploreButton.isVisible()) {
      await exploreButton.click();
      await expect(page).toHaveURL(/.*property/);
    }
  });
});
