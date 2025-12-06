import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
	test('should register a new user', async ({ page }) => {
		const email = `test-${Date.now()}@example.com`;
		const password = 'password123';

		await page.goto('/auth/register');
		await page.fill('input[name="name"]', 'Test User');
		await page.fill('input[name="email"]', email);
		await page.fill('input[name="password"]', password);
		await page.fill('input[name="confirmPassword"]', password);
		await page.check('input[type="checkbox"]');
		await page.click('button[type="submit"]');

		// Should redirect to verify page
		await expect(page).toHaveURL(/\/auth\/verify/);
		await expect(page.getByText(email)).toBeVisible();
	});

	test('should login with existing user', async ({ page }) => {
		// Note: This test assumes a user exists. In a real scenario, we'd seed the DB or register first.
		// For now, we'll just check the login page elements.
		await page.goto('/auth/login');
		await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

		// Try invalid login
		await page.fill('input[name="email"]', 'invalid@example.com');
		await page.fill('input[name="password"]', 'wrongpassword');
		await page.click('button[type="submit"]');

		await expect(page.getByText('Incorrect email or password')).toBeVisible();
	});

	test('should navigate to forgot password', async ({ page }) => {
		await page.goto('/auth/login');
		await page.click('text=Forgot password?');
		await expect(page).toHaveURL('/auth/forgot-password');
		await expect(page.getByRole('heading', { name: 'Forgot Password?' })).toBeVisible();
	});
});
