# Automation setup

## Test target

Configured in TestHound under Settings > Test target (stored locally, gitignored,
at `testhound/.testhound/target.yml`) and injected into every Playwright run and
into the assistant's process.

### Base URL

- `BASE_URL` (also exported as `PLAYWRIGHT_TEST_BASE_URL` / `PLAYWRIGHT_BASE_URL`):
  storefront origin the specs point at. For this demo it is the bundled
  zero-dependency Acme Shop app (`app/server.js`), served at `http://localhost:3000`.

### Environment variables

The specs and the demo app read these from the environment (never hardcoded):

- `ACME_EMAIL` - a valid account email used to sign in.
- `ACME_PASSWORD` - that account's password.

For the demo these use the app's built-in defaults (`app/server.js`). Point them
at a real account by editing the values in Settings > Test target for a non-demo
environment.
