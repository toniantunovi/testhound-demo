# TestHound Demo: Acme Shop

A complete, self-contained showcase repository for [TestHound](https://github.com/toniantunovi/testhound), the Git-native, AI-powered test management desktop app.

Everything TestHound produces lives in this repo as plain, human-readable files: manual test cases, suites, milestones, runs with recorded results, configurations, and the Playwright specs that automate the cases. Alongside them sits a tiny zero-dependency storefront ("Acme Shop") that the tests run against, so the whole thing works out of the box on any machine with Node.js.

## What's inside

```
app/               The app under test: a zero-dependency Node storefront (login,
                   products, cart with tax regions, search, profile)
testhound/         TestHound's file-based test management artifacts
  suites/          Manual test cases as Markdown with YAML front matter,
                   organized into suites (auth, checkout, search, profile, cart)
  runs/            Test runs with per-case recorded results (smoke, regression,
                   checkout rework)
  milestones/      Release milestones the runs roll up into
  configurations/  Browser configurations mapped to Playwright projects
  automation/      Case-to-spec links and the committed automation setup notes
tests/             Playwright specs generated and maintained by coding agents,
                   linked back to the manual cases they automate
```

Every test case file is diffable, reviewable, and mergeable like any other code. Removing TestHound leaves behind a fully usable repository: this repo is exactly what that looks like.

## Run the demo

Prerequisites: [Node.js](https://nodejs.org) 18+.

```bash
npm install
npx playwright install chromium
npm test                # run the Playwright suite (auto-starts the storefront)
```

Other useful commands:

```bash
npm start               # just serve the storefront at http://localhost:3000
npm run test:headed     # watch the tests drive a real browser
```

The Playwright config auto-starts `app/server.js` before the tests and reuses an already-running instance, so `npm test` is all you need.

## Browse the app under test

`npm start`, then open [http://localhost:3000](http://localhost:3000). Demo login:

| Variable        | Default              | Purpose                    |
| --------------- | -------------------- | -------------------------- |
| `BASE_URL`      | `http://localhost:3000` | Storefront origin       |
| `ACME_EMAIL`    | `demo@acme.example`  | Valid account email        |
| `ACME_PASSWORD` | `demo1234`           | That account's password    |

Credentials and the base URL are read from the environment (see `playwright.config.ts`); the defaults exist so the showcase runs with zero setup. In a real project TestHound stores these values locally per machine (gitignored) and exports them into every Playwright run and agent session.

Cart, tax region, and profile state are kept per browser via an anonymous cookie that is independent of the auth session. That keeps parallel Playwright workers isolated and lets the "cart persists across sessions" case pass a logout/login cycle.

## Open it in TestHound

1. Install TestHound (macOS/Linux):

   ```bash
   curl -fsSL https://raw.githubusercontent.com/toniantunovi/testhound/main/install.sh | sh
   ```

2. Open this repository in TestHound. It detects the `testhound/` directory and loads the suites, cases, runs, and results you see here.

From there you can browse the dashboard built from real run data, step through cases, build new runs, execute the linked Playwright specs, and let a coding agent (Claude Code or Codex) generate or update specs from the manual cases.

## How the pieces connect

- **Manual cases** live in `testhound/suites/<suite>/cases/` with structured preconditions, steps, and expectations.
- **Automation links** in `testhound/automation/links.yml` tie each case to the spec that automates it, and TestHound flags drift when a case changes after its spec was generated.
- **Setup notes** in `testhound/automation/setup.md` are the committed context handed to coding agents with every generation prompt: how to start the app, which env vars hold credentials, and selector conventions.
- **Specs** in `tests/` read `baseURL` and credentials from the environment, prefer accessible selectors with `data-testid` fallbacks, and carry a header comment naming the manual case they automate.
- **Runs** in `testhound/runs/` record per-case outcomes (manual and automated) that TestHound's dashboard and history views are built from.

## License

[MIT](LICENSE)
