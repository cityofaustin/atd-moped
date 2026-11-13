# Moped Test Automation Recommendation

_Spike for [atd-data-tech#30650](https://github.com/cityofaustin/atd-data-tech/issues/30650) · October 2026_

**Goal:** a safety net for UI changes, so releases don't depend on one person clicking through 179 QA rows. The norm we're working toward: **every bug fix ships with a regression test.**

This doc uses the release QA sheet as the backlog. It explains which test layer each kind of check belongs in and how we roll it out. The companion docs are:

- [tech-stack.md](./tech-stack.md): which tools, and why
- [issues/](./issues/): one draft GitHub issue per piece of work

---

## TL;DR

- **Five layers, from cheapest to most expensive:** Unit → Component → DB → E2E → Manual. Always test at the cheapest layer that would catch the bug.
- **Tools:**
  - **Vitest** for unit tests. We already have it.
  - **Vitest browser mode + MSW** for component tests. Storybook can sit on top later.
  - **Playwright** for DB and E2E tests, run against the local Docker stack in GitHub Actions.
- **The QA sheet is now tagged.** Every row has a layer, a rationale, a split suggestion, a priority and an issue. **162 of 179 rows can be automated**, fully or partly. 17 stay manual: the map canvas, external services, Cognito and S3.
- **30% of rows mix layers.** Splitting them moves checks out of slow E2E tests into fast ones: Component rows go from 30 to 53, Unit from 19 to 36, and DB from 12 to 20.
- **First step:** land the unit test gate in Netlify ([issue 01](./issues/01-run-unit-tests-in-netlify-builds.md)) and stand up Playwright with three proof tests ([issue 02](./issues/02-playwright-foundation-local-stack-in-ci-login.md)).

---

## Where we are today

|                              | Status on `main`                                   |
| ---------------------------- | -------------------------------------------------- |
| Unit tests                   | 4 legacy helper test files. Vitest is installed.   |
| Tests in Netlify builds      | **No.** Builds run lint, typecheck and build only. |
| Component / DB / E2E tests   | None                                               |
| `data-testid`s in the editor | None                                               |
| Release QA                   | Manual, 179 rows in the QA sheet                   |

The `mateo/vitest_spike` branch already has a Vitest config, a `test:ci` script, the Netlify gate, and the #30040 FDU tests. It's 291 commits behind `main` and conflicts in two files (`package-lock.json`, and `ProjectFunding/helpers.jsx`, now `helpers.tsx`), so issue 01 re-applies its three commits on a new branch.

---

## The five layers

| Layer         | What it catches                                                                                          | Tool                      | Runs in        |
| ------------- | -------------------------------------------------------------------------------------------------------- | ------------------------- | -------------- |
| **Unit**      | Pure rules: validation, formatting, query building, dedupe                                               | Vitest                    | Netlify        |
| **Component** | One component's UI with fake data: tooltips, disabled states, form errors, modal contents                | Vitest browser mode + MSW | Netlify        |
| **DB**        | Values Postgres calculates (views, triggers) and Hasura role permissions                                 | Playwright (API requests) | GitHub Actions |
| **E2E**       | Real flows: save and read back, cross-tab, URL/history, async activity log, grid keyboard, multiple tabs | Playwright (browser)      | GitHub Actions |
| **Manual**    | Map canvas, external services, Cognito user lifecycle, S3 uploads                                        | QA sheet                  | Release day    |

Tool choices and the alternatives we considered are in [tech-stack.md](./tech-stack.md).

---

## How to pick a layer

Ask these questions in order, and stop at the first "yes."

1. **Does it need something we can't run in CI?** That includes drawing, clicking or reading the WebGL map canvas; an external service (Mapbox geocoder, Data Tracker, SharePoint, DTS portal); Cognito user lifecycle or sign-out; or S3 uploads. → **Manual**
2. **Is the rule a pure function of its inputs?** Examples: validation, formatting, query/filter building, URL parsing, dedupe, color mapping. If the logic is tangled into a component, extract it first. → **Unit**
3. **Is the answer calculated in Postgres?** Examples: a view column (`project_list_view`, `current_phase_view`, combined funding/notes views), a trigger (`updated_at`/`updated_by`, council district, confirmed dates), or a role permission. → **DB**
4. **Can you see it by rendering one component with fake data, without saving?** Examples: tooltips, disabled-with-explanation, required-field errors, modal contents, branches on the user's role. It must not depend on DataGridPro editing or Mapbox. → **Component**
5. **Otherwise** it's **E2E**.

Two notes:

- **Split rows that check two things.** Put the rule in Unit or Component and keep only the flow in E2E. Row 84 is an example: the over-limit rule is Unit (rows 92–93), the synced/manual label is Component, and overriding a synced row is E2E.
- **"Setup" rows aren't tests.** Rows like 61, 75 and 87 exist so later rows have data. In Playwright, a GraphQL fixture creates that data instead.

---

## What the QA sheet tells us

[Moped QA Testing - 3.17 La Grange.csv](../Moped%20QA%20Testing%20-%203.17%20La%20Grange.csv) has five new columns:

| Column                       | What it holds                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Suggested coverage layer** | The cheapest layer that catches a regression for the row as a whole                                                   |
| **Coverage layer rationale** | Why, using the questions above                                                                                        |
| **Split suggestion**         | For rows that check more than one thing: `Layer: piece \| Layer: piece`. Blank when the row is already a single test. |
| **Automation priority**      | P1 / P2 / P3 / Manual (see below)                                                                                     |
| **Automation issue**         | Which [issue](./issues/) writes the test(s) for this row                                                              |

Row numbers in these docs are spreadsheet rows.

### By layer

**54 of the 179 rows (30%) mix layers.** "Labeled" counts each row once. "Has a piece here after splitting" counts a split row in every layer it touches, so that column adds up to more than 179.

| Layer     | Labeled | Has a piece here after splitting | Typical work                                                                                                                          |
| --------- | ------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| E2E       | 98      | 113 (67 pure E2E)                | Create/rename/delete project, phase → badge, team edits, funding sync, dashboard, saved views, multi-tab, CSV download                |
| Component | 30      | 53                               | Tooltips, disabled-with-explanation, form validation, modal contents, labels on rows, role-based disabling                            |
| Unit      | 19      | 36                               | Funding amount rules, search query building and URL params, activity log text, dedupe, note length, color mapping                     |
| Manual    | 20      | 22 (17 fully manual)             | Map drawing/zoom/click, geocoder, basemap, S3 upload, Cognito user lifecycle, sign-out                                                |
| DB        | 12      | 20                               | `project_list_view` columns, audit and council-district triggers, synced funding, eCAPRIS-aware latest status, attachment persistence |

E2E stays the biggest layer, but the 67 pure-E2E rows are steps in a scripted journey. They collapse into roughly **25–35 Playwright tests**; for example, rows 61–66 on milestone templates become one test.

### Split patterns

| Pattern                                            | What moves                                                                                         | Example rows                          |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------- |
| A rule inside a flow                               | Validation, defaults or formatting go to Unit/Component. E2E keeps only the save.                  | 19, 30, 49, 81, 84, 90, 93            |
| "…then check the activity log"                     | Wording comes from `utils/activityLogFormatters/` (Unit). E2E only confirms that an entry appears. | 45, 60, 66, 108, 110, 122             |
| A number Postgres calculates and the UI just shows | Assert the view or trigger output (DB). Keep at most a light UI check.                             | 34, 38, 54, 76, 83, 95, 104, 117, 119 |
| One step plus a tooltip or label                   | The tooltip or label becomes a Component test.                                                     | 69, 85, 100, 107, 149                 |
| Part map, part testable                            | Pull out the logic (layer style, query variables, URL param). Only the visual check stays manual.  | 23, 44, 47, 159                       |

### Priority

| Priority   | Meaning                                                                                                                                                            | Rows |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- |
| **P1**     | On the release smoke path, or in a high-risk, high-churn area (funding, eCAPRIS, phases/status, project list data, search). Also cheap unit tests for those areas. | 48   |
| **P2**     | Important and stable: most of Summary, Timeline, Team, Notes, Dashboard and Projects list                                                                          | 72   |
| **P3**     | Low risk, library behavior, cosmetic, or already covered by another row                                                                                            | 42   |
| **Manual** | Not planned for automation                                                                                                                                         | 17   |

Recent QA sheet dates were a strong signal for P1. Funding and attachments had rows added or changed from June to October 2026, and those are the areas most likely to regress.

---

## Worked example: #30040

This is the pattern we want for every bug fix.

1. **Bug:** the import dialog let users add an FDU that was already on the project.
2. **Fix + test:** pull the "is this FDU already present?" rule into exported helpers (`getPresentFduStrings`, `isFduOptionDisabled`), then unit-test them with a case table. There's no need to mount DataGridPro.

| Case                                    | Expectation                    |
| --------------------------------------- | ------------------------------ |
| New manual row; FDU already on project  | Option disabled + helper text  |
| Editing a row that already has that FDU | Same option stays enabled      |
| FDU not on project                      | Option enabled; no helper text |
| Null / empty option or empty FDU list   | Never disabled                 |

The code lives on `mateo/vitest_spike` and lands with [issue 01](./issues/01-run-unit-tests-in-netlify-builds.md).

---

## How the tests run

**Environment.** DB and E2E tests run against the **local Docker stack** (`database/hasura-cluster start`: Postgres + Hasura + seed + migrations), not staging. It's reproducible for each PR and safe to change. Staging is shared and drifts, though we could add a nightly smoke run there later.

**Login.** Hasura validates Cognito JWTs, so tests need real tokens. The login page supports email/password alongside SSO. We'll use two dedicated non-SSO users (editor + admin) in the staging pool, created from the staging Staff page, with matching `moped_users` rows seeded in the CI database because tokens carry the staging `user_id`. A Playwright `setup` step logs each in once and saves the session for every test.

**Test data.**

- Each test creates its own project through GraphQL, with a unique name. The UI is used only for the behavior under test. That keeps tests independent, so they don't depend on the sheet's "do steps 1–40 in order."
- About 20 rows need eCAPRIS subprojects, FDUs and statuses. A SQL seed provides them ([issue 03](./issues/03-test-data-ecapris-fixtures-and-reference-seed.md)).

**The activity log is asynchronous.** Hasura event triggers write it after the action, so tests poll for entries (`expect.poll`) rather than checking right away.

**Selectors.** Use `getByRole` / `getByLabel` first, which also nudges accessibility. Add a `data-testid` only where MUI makes roles ambiguous, such as grid cells and map containers.

**CI.**

| Where                           | What                                                                                               | When                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Netlify                         | lint, typecheck, `vitest run` (unit + component)                                                   | Every PR and deploy preview               |
| GitHub Actions `editor-e2e.yml` | Docker stack → migrate/metadata/seed → `vite build && vite preview` → `playwright test` (DB + E2E) | PRs touching `editor/**` or `database/**` |
| Artifacts                       | Playwright HTML report + traces                                                                    | Every run                                 |

Netlify has no Docker, which is why DB and E2E tests run in GitHub Actions.

---

## Rollout

Full plan and dependency graph: [issues/README.md](./issues/README.md).

| Wave               | Issues                                                                                                | Outcome                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **1. Foundations** | 01 Netlify gate · 02 Playwright + CI + login · 04 Component setup · 03 eCAPRIS fixtures · 05 DB tests | Tests run in CI at every layer          |
| **2. P1 coverage** | 06 Unit: funding · 07 Unit: search · 11 E2E: timeline · 13 E2E: funding · 16 Component: project view  | High-risk areas covered                 |
| **3. P2 coverage** | 08 · 09 · 10 · 12 · 14 · 15 · 17                                                                      | The rest of the release smoke path      |
| **Anytime**        | 18 QA sheet process                                                                                   | Manual QA shrinks as rows get automated |

---

## Team norms

**Do**

- Ship every bug fix with a test at the cheapest layer that would have caught it.
- Export a pure helper rather than testing logic through the UI.
- Keep tests next to the code, in `src/**/test/*.test.(js|ts)`, which is the existing convention. E2E tests go in `editor/e2e/`.
- Tag new QA sheet rows with a layer when you add them.

**Don't**

- Block small UI fixes on writing a full E2E test.
- Chase a coverage % as the goal.
- Use DOM snapshot tests (`toMatchSnapshot`) on MUI components. They break on every library bump.

---

## Open questions

1. Who owns rotating the test users' passwords?
2. Does the activity log event trigger fire reliably inside the GitHub Actions Docker network? The second proof test in issue 02 will tell us.
3. Can we use the Mapbox token in CI? The map tab has to load even though tests never draw on it.
4. Should we adopt Storybook? We'll decide after the half-day trial in [issue 04](./issues/04-component-test-setup-vitest-browser-mode-msw.md).
5. The old proposal mentioned fixing the API test suite (#10263). Is that still wanted, and should it join this plan?
