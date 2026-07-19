import { test, expect } from '@playwright/test';

/**
 * Manual case: TC-0001 - Login with valid credentials (suite: auth)
 *
 * Preconditions: User is on the Acme Shop storefront.
 *
 * Credentials and base URL come from the environment (see playwright.config.ts):
 *   BASE_URL       - storefront origin, used as baseURL
 *   ACME_EMAIL     - a valid account email
 *   ACME_PASSWORD  - that account's password
 *
 * NOTE: The selectors below could not be verified against a running Acme Shop
 * instance (no app/URL was available in this repo at authoring time). They use
 * resilient role/label queries and are flagged as ASSUMPTIONS; confirm them (or
 * add the suggested data-testid attributes) against the real storefront.
 */
test('Login with valid credentials', async ({ page }) => {
  const email = process.env.ACME_EMAIL;
  const password = process.env.ACME_PASSWORD;
  expect(
    email && password,
    'Set ACME_EMAIL and ACME_PASSWORD in the environment before running.',
  ).toBeTruthy();

  // --- Step 1: Open the login page ---
  // Expected: Email and password fields are visible.
  // ASSUMPTION: the login route is `/login`. Suggested testid: data-testid="login-page".
  await page.goto('/login');

  // ASSUMPTION: fields are labelled "Email"/"Password". Prefer role/label queries;
  // if labels are missing, add data-testid="login-email" / data-testid="login-password".
  const emailField = page.getByLabel(/email/i);
  const passwordField = page.getByLabel(/password/i);
  await expect(emailField).toBeVisible();
  await expect(passwordField).toBeVisible();

  // --- Step 2: Enter valid credentials and submit ---
  // Expected: User lands on the dashboard.
  await emailField.fill(email!);
  await passwordField.fill(password!);

  // ASSUMPTION: the submit control is a button named "Log in"/"Sign in".
  // Suggested testid: data-testid="login-submit".
  await page.getByRole('button', { name: /log ?in|sign ?in/i }).click();

  // ASSUMPTION: a successful login navigates to `/dashboard` and renders a
  // dashboard landmark. Suggested testid: data-testid="dashboard".
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(
    page.getByRole('heading', { name: /dashboard/i }),
  ).toBeVisible();
});
