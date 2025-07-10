

import { test, expect } from '@playwright/test';

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001/login'); // Change URL if necessary
  });

  test('should show error on invalid login attempt', async ({ page }) => {
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.getByText('Sign In').click();
    
    await expect(page.locator('text=User Not Registered!!')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'dhirajbalayar0@gmail.com');
    await page.fill('input[name="password"]', 'Dhiraj@123');
    await page.getByText('Sign In').click();



    await page.waitForTimeout(500); // Wait for redirection
    await expect(page).toHaveURL('http://localhost:3001/'); // Change based on role
  });
});
