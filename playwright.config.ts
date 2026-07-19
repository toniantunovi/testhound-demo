import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the Acme Shop storefront tests.
 *
 * The base URL and credentials are read from the environment so nothing
 * sensitive is committed. For this local TestHound demo they default to the
 * bundled zero-dependency storefront in ./app; override any of them with real
 * values in a real environment:
 *
 *   BASE_URL       - storefront origin (also used to launch the local app)
 *   ACME_EMAIL     - a valid account email
 *   ACME_PASSWORD  - that account's password
 */
process.env.BASE_URL ||= 'http://localhost:3000';
process.env.ACME_EMAIL ||= 'demo@acme.example';
process.env.ACME_PASSWORD ||= 'demo1234';

const baseURL = process.env.BASE_URL;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node app/server.js',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: new URL(baseURL).port || '3000',
      ACME_EMAIL: process.env.ACME_EMAIL,
      ACME_PASSWORD: process.env.ACME_PASSWORD,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
