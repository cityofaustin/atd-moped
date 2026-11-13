# Testing Tech Stack

*Companion to [recommendation.md](./recommendation.md) · October 2026*

This covers which tool we use for each test layer, why we picked it, and what else we considered. The short version: **two runners, one browser.** Vitest runs the fast tests, Playwright runs the full-stack tests, and both drive the same Chromium.

---

## At a glance

| Layer | What it tests | Pick | New to us? |
|---|---|---|---|
| **Unit** | Pure logic: validation, formatting, query building | **Vitest** | No, already installed |
| **Component** | One component's UI with fake data | **Vitest browser mode** + **MSW** | Yes |
| **DB** | Postgres views, triggers, Hasura permissions | **Playwright** (API requests, no browser) | Yes |
| **E2E** | Real user flows across the full stack | **Playwright** | Yes |
| **Manual** | Map canvas, external services, Cognito | The QA sheet | No |

```
              Vitest                          Playwright
   ┌──────────────────────────┐   ┌──────────────────────────────┐
   │ Unit         (Node)      │   │ DB    (HTTP → Hasura)        │
   │ Component    (Chromium) ─┼───┼─ E2E  (Chromium → full stack)│
   └──────────────────────────┘   └──────────────────────────────┘
          runs in Netlify             runs in GitHub Actions
                                      (needs Docker for Postgres + Hasura)
```

Component tests and E2E tests use the same Playwright-managed Chromium, so there's only one browser to install and keep updated.

---

## Unit tests: Vitest

**Why:** It's already in `package.json` (v4) and reads our `vite.config.js`, so path aliases, TypeScript and JSX work with no extra config. Its API matches Jest's, so most examples online carry over.

| Option | Verdict |
|---|---|
| **Vitest** ✅ | Already installed, Vite-native, fast watch mode. |
| Jest | Industry default, but needs Babel or SWC transforms and separate alias config to match Vite. It would be a second toolchain for no gain. |
| Node's built-in `node:test` | No JSX or TS transforms, and few matchers. Too bare for a React app. |

---

## Component tests

### Pick: Vitest browser mode + `vitest-browser-react` + MSW

**What it is:** The same Vitest we use for unit tests, but each component test runs in a real Chromium tab instead of a simulated DOM. Browser mode became stable in **Vitest 4**, which we're already on.

**Why this over the "classic" setup (jsdom + React Testing Library):**

- **MUI behaves like it does in production.** Tooltips, popovers, focus traps and DataGridPro rely on real layout and focus, which jsdom fakes badly. Several QA rows (tooltips on disabled buttons, keyboard in dropdowns) are exactly the cases where jsdom tests go flaky or lie.
- **Same runner, same config.** Unit and component tests run in one `vitest` command as two "projects."
- **Same browser as E2E.** The Playwright Chromium we install for E2E powers these too.
- **Screenshots are built in** if we want visual checks later (`toMatchScreenshot`, see below).

**The trade-off:** It's slower than jsdom (seconds rather than milliseconds per file), and Netlify's build needs Chromium installed. Both are acceptable at our size.

**Mocking GraphQL with MSW (Mock Service Worker):** MSW intercepts network requests and returns fake responses, keyed by GraphQL operation name. We picked it over Apollo's `MockedProvider` because:

| | MSW ✅ | Apollo `MockedProvider` |
|---|---|---|
| How it matches | By operation name; you decide how strict | Exact query **and** variables, or the test fails silently |
| Reusable in | Vitest, Storybook, local dev, even Playwright | Apollo tests only |
| Error and loading states | Easy (`HttpResponse.error()`, delays) | Possible but awkward |

### About Storybook

**Short answer: Storybook is still the modern choice. It has just changed shape.**

- **The old snapshot addon is gone.** Storyshots was removed in Storybook 8. If that's what your past experience was, its replacement is different.
- **Stories are now tests.** Since Storybook 9, the **Vitest addon** runs every story as a component test in **Vitest browser mode**, the same engine recommended above. A story's `play` function (click this, type that, expect this) becomes the test body.
- **What Storybook adds on top of plain component tests:**
  - A browsable catalog of components in each state, which is good for design review and onboarding.
  - Accessibility checks per story.
  - Visual snapshots, through Chromatic (Storybook's hosted service) or a self-hosted screenshot setup.
- **What it costs:** A second dev server and config, "decorators" for the MUI theme, router, Apollo and auth, and a story to maintain per component state. Without a shared component library, many of our stories would be one-offs for a single screen.

**Recommendation:** Start with plain Vitest browser mode tests ([issue 04](./issues/04-component-test-setup-vitest-browser-mode-msw.md)), and **timebox a half-day Storybook trial** in that same issue. That isn't a fork in the road:
- Storybook's Vitest addon runs on the same Vitest browser setup.
- MSW mocks plug into Storybook through `msw-storybook-addon`.
- Our render helper becomes a Storybook decorator.

If the team wants the catalog and visual review, we add Storybook on top later without throwing anything away.

### Alternatives considered

| Option | Verdict |
|---|---|
| **Vitest browser mode** ✅ | Real browser, same runner as unit tests, stable in Vitest 4. |
| **Storybook + Vitest addon** 🟡 | The same engine plus a catalog and visual review. Worth adding if the trial is positive. See above. |
| Vitest + jsdom + React Testing Library | The previous plan. Fastest, but jsdom fakes layout and focus, which is where MUI and DataGridPro break. |
| Playwright Component Testing | Still labeled **experimental**, and its API has changed between releases. Not worth the churn. |
| Cypress Component Testing | Mature, but it would bring in Cypress as a third tool when Playwright already covers E2E. |

### Snapshots and visual testing

There are two kinds, and they behave very differently:

| Kind | How it works | Our take |
|---|---|---|
| **DOM snapshot** (`toMatchSnapshot`) | Saves the rendered HTML and fails if it changes | ❌ Skip. MUI generates class names, so these fail on every library bump and people learn to just press "update." |
| **Visual snapshot** (screenshot diff) | Saves an image and fails if pixels change | 🟡 Later. Useful for status badges, chips and colors. Needs stable fonts and data, plus baselines generated on Linux in CI. |

Visual snapshot options, when we're ready:

- **Vitest `toMatchScreenshot`:** free, built in, baselines committed to git. Start here.
- **Playwright `toHaveScreenshot`:** the same idea for full pages in E2E. Avoid it on the map, because tiles load from the network.
- **Chromatic, Argos, Percy:** hosted services with a review UI for approving changes in PRs. Paid beyond their free tiers. Worth it only if visual review becomes a real team habit.

---

## DB tests: Playwright API requests

**Why:** We assert on what Hasura returns, using its GraphQL API with the admin secret and `x-hasura-role` headers. These tests share the E2E stack, CI job, fixtures and reports, so there's no extra tool to learn. They also test permissions the way the app actually hits them, through Hasura.

| Option | Verdict |
|---|---|
| **Playwright `request`** ✅ | Same runner and CI job as E2E. Tests views, triggers and Hasura permissions together. |
| pgTAP | Pure-SQL tests that sit next to migrations. Ideal for triggers, but it's a separate toolchain, and it skips Hasura permissions. Revisit if the DB suite grows large. |
| Vitest (Node) + a GraphQL client | Works too, but Vitest isn't set up to boot or wait for the Docker stack. Playwright already is. |
| pytest | Fits our Python ETLs, but it would be a third test language for editor-facing behavior. |

---

## E2E tests: Playwright

**Why:** The QA sheet has flows that Playwright handles natively and other tools find awkward:

| QA sheet need | Playwright | Cypress |
|---|---|---|
| Multi-tab flows (move a component, check the other project) | `context.newPage()` | Not supported; needs workarounds |
| CSV downloads | `page.waitForEvent("download")` | Plugin or filesystem polling |
| Keyboard inside DataGridPro | Real browser key events | Synthetic events; MUI focus issues |
| Parallel CI runs | Free, built in | Paid (Cypress Cloud) |
| Debugging a CI failure | **Trace viewer:** step-by-step DOM, network and console | Video and screenshots |

**Handy extras for the team:**

- **`npx playwright codegen`** records clicks into a draft test. It's a good way to turn a QA sheet row into a starting script, even for people who don't write tests often.
- **`@axe-core/playwright`** adds an accessibility scan to any E2E page in one line. It's optional, and cheap to add later.

| Option | Verdict |
|---|---|
| **Playwright** ✅ | Multi-tab, downloads, real keyboard, free parallelism, trace viewer. Also powers our component and DB tests. |
| Cypress | Friendly runner UI, but it runs one tab at a time, and parallel CI is paid. |
| WebdriverIO | Capable and standards-based, but more setup, and it isn't used elsewhere in our stack. |
| Selenium | Legacy option. Slower and more boilerplate. |

---

## What we'd add to `editor/package.json`

| Package | Layer | Issue |
|---|---|---|
| `@playwright/test` | DB, E2E (and supplies Chromium) | [02](./issues/02-playwright-foundation-local-stack-in-ci-login.md) |
| `@vitest/browser-playwright`, `vitest-browser-react` | Component | [04](./issues/04-component-test-setup-vitest-browser-mode-msw.md) |
| `msw` | Component (later Storybook, dev) | [04](./issues/04-component-test-setup-vitest-browser-mode-msw.md) |
| *Optional:* `storybook`, `@storybook/react-vite`, `@storybook/addon-vitest`, `msw-storybook-addon` | Component catalog + visual | After the trial in 04 |
| *Optional:* `@axe-core/playwright` | Accessibility in E2E | Any time after 02 |

---

## Sources

- [Vitest 4 announcement](https://voidzero.dev/posts/announcing-vitest-4): browser mode stable, visual regression testing
- [Storybook: Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) and [Storybook Test (v9)](https://storybook.js.org/docs/writing-tests)
- [Storybook: Storyshots migration guide](https://storybook.js.org/docs/writing-tests/storyshots-migration-guide): Storyshots removed in 8.0
- [Playwright: Components (experimental)](https://playwright.dev/docs/test-components)
- [Argos: Vitest visual testing](https://argos-ci.com/blog/vitest-visual-testing): vendor write-up on screenshot baselines
