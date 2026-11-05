import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
import { defineConfig, devices } from "@playwright/test";

/* Local logins live in e2e/.env. In CI they come from GitHub secrets. */
const localEnvFile = path.join(__dirname, "e2e/.env");
if (existsSync(localEnvFile)) {
  process.loadEnvFile(localEnvFile);
}

const baseURL = "https://localhost:4173";
const hasuraUrl = process.env.E2E_HASURA_URL ?? "http://localhost:8082";
const isCI = Boolean(process.env.CI);

/**
 * Build the app against the local Hasura and the staging Cognito pool that
 * Hasura trusts. Environment variables take priority over .env files, and
 * --mode e2e keeps Vite from reading .env.production or .env.staging.
 */
const appEnv = {
  ...parseEnv(readFileSync(path.join(__dirname, "env_template"), "utf8")),
  VITE_HASURA_ENDPOINT: `${hasuraUrl}/v1/graphql`,
  /* Mapbox only checks this token's format. Tests stub its requests with stubMapbox(). */
  VITE_MAPBOX_TOKEN: `pk.${Buffer.from(JSON.stringify({ u: "e2e", a: "e2e" })).toString("base64url")}.e2e`,
} as Record<string, string>;

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/support/globalSetup.ts",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 90_000,
  reporter: isCI
    ? [["list"], ["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    actionTimeout: 15_000,
    locale: "en-US",
    timezoneId: "America/Chicago",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    /**
     * Traces record request headers and session storage, including real login
     * tokens. This repo is public and so are its CI artifacts, so traces stay
     * local. See e2e/README.md.
     */
    trace: isCI ? "off" : "retain-on-failure",
  },
  projects: [
    {
      name: "db",
      testMatch: "db/**/*.spec.ts",
    },
    {
      name: "e2e",
      testMatch: "flows/**/*.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        storageState: "e2e/.auth/editor.json",
      },
    },
  ],
  webServer: {
    command:
      "npx vite build --mode e2e && npx vite preview --mode e2e --port 4173 --strictPort",
    url: `${baseURL}/moped/`,
    ignoreHTTPSErrors: true,
    reuseExistingServer: false,
    timeout: 180_000,
    env: appEnv,
  },
});
