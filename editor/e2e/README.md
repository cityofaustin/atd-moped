# Playwright tests

These tests run against a local Postgres + Hasura stack, so each run starts from a known database and never changes staging.

| Folder | What it tests | Browser? |
|---|---|---|
| `e2e/flows/` | Real user flows through the app | Yes |
| `e2e/db/` | Values Postgres calculates, and Hasura permissions | No |

See [the recommendation](../../docs/test-automation/recommendation.md) for which layer a new test belongs in.

## Run the tests locally

1. Start a freshly seeded local stack. **Don't use a stack replicated from a snapshot.** The test users' IDs can belong to real staff there, so global setup stops with an error instead of changing those rows.

   If you have no local data to keep:

   ```shell
   cd database
   ./hasura-cluster start
   ```

   If your local stack has data you want to keep, pause it and run the tests on a separate one. `./hasura-cluster stop` and `restart` delete local data, so don't use them for this.

   ```shell
   cd database
   docker compose stop
   docker compose -p moped-e2e up -d
   until curl -s localhost:8082/healthz | grep -q OK; do sleep 2; done
   hasura migrate apply --database-name default
   hasura metadata apply
   hasura seeds apply --database-name default
   ```

   When you're done, remove it and resume your own stack:

   ```shell
   docker compose -p moped-e2e down --volumes
   docker compose start
   ```

2. Add the test users' logins:

   ```shell
   cd editor
   cp e2e/.env.example e2e/.env
   ```

   Fill in `e2e/.env` from 1Password. The file is gitignored.

3. Install Chromium once, then run the tests:

   ```shell
   nvm use
   npx playwright install chromium
   npm run test:e2e
   ```

Each run builds the app, starts it on port 4173, logs in both test users, then runs the tests.

These commands are useful while writing a test:

```shell
# Pick and watch tests in a window
npx playwright test --ui

# Run one file
npx playwright test e2e/flows/project-phases.spec.ts

# See the last run's results
npx playwright show-report
```

Running the tests adds the test users to the seeded database, and each run adds test projects to it.

## Write a test from a QA sheet row

`codegen` records your clicks into a draft test. Start the app and record in another terminal:

```shell
npx vite build --mode e2e && npx vite preview --mode e2e --port 4173
npx playwright codegen --ignore-https-errors --load-storage=e2e/.auth/editor.json https://localhost:4173/moped/projects/new
```

`e2e/.auth/editor.json` exists after you've run the tests once. Without `VITE_` overrides, that build uses your `.env.local`, so check that it points at your local Hasura.

Then clean up the draft:

- **Make your own data.** Call `createProject()` from `e2e/support/hasura.ts` instead of relying on data from another test. Use `uniqueName()` for anything you create in the UI.
- **Find elements the way users do.** Prefer `getByRole` and `getByLabel` over CSS classes, which change when MUI updates.
- **Wait for the activity log.** Hasura writes it asynchronously, so use `waitForActivity()` instead of a fixed delay.
- **Stub outside services.** Tests shouldn't depend on anything outside the local stack. `e2e/support/stubs.ts` has `stubSignals()` for the Socrata signal data and `stubMapbox()` for any test that opens a map. The build uses a fake Mapbox token, so the Map tab can't load real tiles.
- **Check something specific.** A loose check can pass on the wrong page. An early version of the signal test kept passing while the Map tab was crashing, because the text it looked for also appeared elsewhere.
- **Note the QA sheet rows** in a comment above the test.

## Test users and CI

`e2e/support/testUsers.ts` lists two users, editor and admin. They're dedicated non-SSO users in the staging Cognito pool, because that's the pool the local Hasura trusts.

- **New test users:** create them from the Staff page on staging, not the AWS console. Only the Staff page writes the claims their login token needs.
- **User IDs:** login tokens carry the staging `user_id`, and the app looks up `moped_users` with it. Global setup adds matching rows to the local database. If the IDs don't match, login fails and the error tells you what to check.
- **CI:** `.github/workflows/editor-e2e.yml` runs on PRs that change `editor/` or `database/`. It reads the logins from the repository secrets `E2E_EDITOR_EMAIL`, `E2E_EDITOR_PASSWORD`, `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD`. Fork and Dependabot PRs can't read secrets, so the job skips them.

## Debugging CI failures

Each run uploads an HTML report with a screenshot and video of any failure. Download `playwright-report` from the Actions run and open it with `npx playwright show-report <folder>`.

**CI doesn't save traces.** Traces include request headers and browser storage, which means real login tokens, and artifacts on this public repo can be downloaded by anyone with a GitHub account. To get a trace, reproduce the failure locally, where traces are on for failed tests. Don't share those trace files outside the team.
