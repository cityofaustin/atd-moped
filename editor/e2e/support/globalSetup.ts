import { chromium, type FullConfig } from "@playwright/test";
import { adminGql } from "./hasura";
import { storageStatePath, testUsers } from "./testUsers";

type TestUser = (typeof testUsers)[keyof typeof testUsers];

/**
 * Add the test users to the local database, because a login token only works
 * when moped_users has a row with the same user_id. Safe to run repeatedly.
 *
 * In a database replicated from a snapshot, these IDs can belong to real staff.
 * Stop instead of changing their rows or adding test data to that database.
 */
const seedUser = async (user: TestUser, email: string) => {
  const { moped_users_by_pk: existingUser } = await adminGql<{
    moped_users_by_pk: { email: string } | null;
  }>(
    `query ExistingTestUser($userId: Int!) {
      moped_users_by_pk(user_id: $userId) { email }
    }`,
    { userId: user.userId }
  );

  if (existingUser) {
    if (existingUser.email.toLowerCase() === email.toLowerCase()) {
      return;
    }
    throw new Error(
      `User ${user.userId} in the local database isn't the ${user.title} test ` +
        `user, so this looks like a replicated database. These tests need a ` +
        `freshly seeded stack. See "Run the tests locally" in e2e/README.md.`
    );
  }

  await adminGql(
    `mutation SeedTestUser($object: moped_users_insert_input!) {
      insert_moped_users_one(object: $object) { user_id }
    }`,
    {
      object: {
        user_id: user.userId,
        first_name: "Moped",
        last_name: user.title,
        title: user.title,
        email,
        roles: [user.role],
        workgroup_id: 3,
        is_coa_staff: true,
        is_deleted: false,
      },
    }
  );
};

/**
 * Log in through the real login page and save the session for tests to reuse.
 *
 * This runs in global setup rather than as a Playwright test on purpose.
 * Test steps go into the HTML report, which CI publishes, and step details can
 * include the values typed into a field.
 */
const logIn = async (
  baseURL: string,
  name: keyof typeof testUsers,
  email: string,
  password: string
) => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    baseURL,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  await page.goto("/moped/session/signin");
  /* The email and password form opens from the "External user?" link */
  await page
    .getByText("External user?")
    .locator("..")
    .getByRole("link", { name: "here" })
    .click();
  await page.getByLabel("Email Address").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in now" }).click();

  try {
    /* The top nav only renders once Cognito and moped_users both accept the user */
    await page
      .getByRole("tab", { name: "Projects" })
      .waitFor({ timeout: 30_000 });
  } catch {
    await browser.close();
    throw new Error(
      `The ${name} test user couldn't log in. Check its credentials, and that ` +
        `userId in e2e/support/testUsers.ts matches moped_users on staging.`
    );
  }

  await context.storageState({ path: storageStatePath(name) });
  await browser.close();
};

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL as string;

  for (const name of Object.keys(testUsers) as (keyof typeof testUsers)[]) {
    const user = testUsers[name];
    const email = process.env[user.emailVar];
    const password = process.env[user.passwordVar];

    if (!email || !password) {
      throw new Error(
        `Missing ${user.emailVar} or ${user.passwordVar}. Add them to ` +
          `e2e/.env locally (see e2e/.env.example) or to GitHub secrets in CI.`
      );
    }

    await seedUser(user, email);
    await logIn(baseURL, name, email, password);
  }
}
