import { test, expect } from '@playwright/test';

const BASE_URL = 'https://firechat-qa.netlify.app';

// Use a real test account you create manually in Firebase first
const VALID_EMAIL = 'testuser@firechat.com';
const VALID_PASSWORD = 'Test1234!';

test.describe('Authentication', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('login page loads with email and password fields', async ({ page }) => {
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#submit-btn')).toBeVisible();
  });

test('user can log in with valid credentials', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`); // go directly to login page
  await page.locator('#email').fill(VALID_EMAIL);
  await page.locator('#password').fill(VALID_PASSWORD);
  await page.locator('#submit-btn').click();

  await expect(page.locator('[data-testid="chat-ui"]')).toBeVisible({ timeout: 15000 });
});

  test('login fails silently with wrong password - form stays visible', async ({ page }) => {
    await page.locator('#email').fill(VALID_EMAIL);
    await page.locator('#password').fill('wrongpassword123');
    await page.locator('#submit-btn').click();

    // Login form should still be visible — user was not redirected
    await expect(page.locator('#submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('login fails with empty email field', async ({ page }) => {
    await page.locator('#password').fill(VALID_PASSWORD);
    await page.locator('#submit-btn').click();

    // Form should remain — no navigation happened
    await expect(page.locator('#submit-btn')).toBeVisible();
  });

  test('login fails with empty password field', async ({ page }) => {
    await page.locator('#email').fill(VALID_EMAIL);
    await page.locator('#submit-btn').click();

    // Form should remain — no navigation happened
    await expect(page.locator('#submit-btn')).toBeVisible();
  });

});