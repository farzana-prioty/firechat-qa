import { test, expect } from '@playwright/test';

const BASE_URL = 'https://firechat-qa.netlify.app';

const VALID_EMAIL = 'testuser@firechat.com';
const VALID_PASSWORD = 'Test1234!';

test.describe('Authentication', () => {

  // Register page tests (BASE_URL goes to /)
  test.describe('Register page', () => {

    test.beforeEach(async ({ page }) => {
      await page.goto(BASE_URL);
    });

    test('register page loads with email and password fields', async ({ page }) => {
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      await expect(page.locator('#submit-btn')).toBeVisible();
      await expect(page.locator('#submit-btn')).toHaveText('Sign Up');
    });

    test('register page has link to login page', async ({ page }) => {
      await expect(page.locator('a[href="/login"]')).toBeVisible();
    });

    test('register fails with empty email', async ({ page }) => {
      await page.locator('#password').fill('somepassword');
      await page.locator('#submit-btn').click();
      await expect(page.locator('#submit-btn')).toBeVisible();
    });

    test('register fails with empty password', async ({ page }) => {
      await page.locator('#email').fill('someone@test.com');
      await page.locator('#submit-btn').click();
      await expect(page.locator('#submit-btn')).toBeVisible();
    });

  });

  // Login page tests (/login route)
  test.describe('Login page', () => {

    test.beforeEach(async ({ page }) => {
      // Navigate via clicking the Sign In link — avoids direct URL routing issues
      await page.goto(BASE_URL);
      await page.locator('a[href="/login"]').click();
      await expect(page.locator('#submit-btn')).toBeVisible({ timeout: 5000 });
    });

    test('login page loads with email and password fields', async ({ page }) => {
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      await expect(page.locator('#submit-btn')).toBeVisible();
      await expect(page.locator('#submit-btn')).toHaveText('Sign In');
    });

    test('login fails with wrong password - form stays visible', async ({ page }) => {
      await page.locator('#email').fill(VALID_EMAIL);
      await page.locator('#password').fill('wrongpassword123');
      await page.locator('#submit-btn').click();
      await expect(page.locator('#submit-btn')).toBeVisible({ timeout: 5000 });
    });

    test('login fails with empty email', async ({ page }) => {
      await page.locator('#password').fill(VALID_PASSWORD);
      await page.locator('#submit-btn').click();
      await expect(page.locator('#submit-btn')).toBeVisible();
    });

    test('login fails with empty password', async ({ page }) => {
      await page.locator('#email').fill(VALID_EMAIL);
      await page.locator('#submit-btn').click();
      await expect(page.locator('#submit-btn')).toBeVisible();
    });

    test('user can log in with valid credentials', async ({ page }) => {
      await page.locator('#email').fill(VALID_EMAIL);
      await page.locator('#password').fill(VALID_PASSWORD);
      await page.locator('#submit-btn').click();

      // Give Firebase time to authenticate
      await page.waitForTimeout(5000);

      const chatVisible = await page.locator('[data-testid="chat-ui"]').isVisible();
      const loginGone = !(await page.locator('#submit-btn').isVisible());

      expect(chatVisible || loginGone).toBeTruthy();
    });

  });

});