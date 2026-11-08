import { expect, test } from "@playwright/test";
import { uniqueName } from "../support/hasura";
import { stubMapbox, stubSignals } from "../support/stubs";

const PROJECT_URL = /\/moped\/projects\/(\d+)/;

/* QA sheet rows 3, 4, 6, 7, 8, 9, 10 and 11 */
test("create, follow, rename and delete a project", async ({ page }) => {
  const projectName = uniqueName("E2E lifecycle");
  const secondaryName = "Secondary name";
  const description = `Description for ${projectName}`;

  await test.step("create the project", async () => {
    await page.goto("/moped/projects/new");
    await page.getByLabel("Project name").fill(projectName);
    await page.getByLabel("Secondary name").fill(secondaryName);
    await page.getByLabel("Description").fill(description);
    await page.getByRole("button", { name: "Create" }).click();
    await page.waitForURL(PROJECT_URL);
  });

  const projectId = page.url().match(PROJECT_URL)?.[1];

  await test.step("the summary shows what was entered", async () => {
    await expect(page.getByRole("heading", { name: projectName })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: secondaryName })
    ).toBeVisible();
    await expect(page.getByText(description)).toBeVisible();
    await expect(page.getByText(`Project #${projectId}`)).toBeVisible();
  });

  await test.step("the creator follows it, and can unfollow", async () => {
    const unfollow = page.getByRole("button", {
      name: "unfollow",
      exact: true,
    });
    await expect(unfollow).toBeVisible();
    await unfollow.click();
    await expect(
      page.getByRole("button", { name: "follow", exact: true })
    ).toBeVisible();
  });

  const newName = uniqueName("E2E renamed");
  const newSecondaryName = "New secondary name";

  await test.step("rename both names", async () => {
    await page.getByRole("heading", { name: projectName }).click();
    await page.getByLabel("Project name").fill(newName);
    await page.getByLabel("Secondary name").fill(newSecondaryName);
    /* The save button has no accessible name, only a "check" icon */
    await page.getByRole("button").filter({ hasText: /^check$/ }).click();

    await expect(page.getByRole("heading", { name: newName })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: newSecondaryName })
    ).toBeVisible();
  });

  await test.step("delete it and land on the projects list", async () => {
    /* The "..." menu button has no accessible name */
    await page.locator('[aria-controls="fade-menu"]').click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete project" }).click();
    await page.waitForURL(/\/moped\/projects\/?(\?.*)?$/);
  });

  await test.step("going back shows the deleted project message", async () => {
    await page.goBack();
    await expect(page.getByText("This project has been deleted.")).toBeVisible();
  });
});

/**
 * QA sheet rows 12 and 27. Signals come from Austin's open data API rather than
 * our database, so the response is stubbed. The test checks the component list
 * and doesn't touch the map itself.
 */
test("create a signal project and see its component on the Map tab", async ({
  page,
}) => {
  const locationName = uniqueName("E2E signal at Lamar");

  await stubMapbox(page);
  await stubSignals(page, { signalId: "9001", locationName });

  await page.goto("/moped/projects/new");
  await page.getByText("Use signal asset").click();
  await page.getByRole("combobox", { name: "Signal" }).fill("9001");
  await page
    .getByRole("option", { name: `9001: ${locationName}`, exact: true })
    .click();
  await page.getByLabel("Description").fill(`Signal project ${locationName}`);
  await page.getByRole("button", { name: "Create" }).click();
  await page.waitForURL(PROJECT_URL);

  await expect(page.getByRole("heading", { name: locationName })).toBeVisible();

  await page.getByRole("tab", { name: "Map" }).click();
  await expect(
    page.getByRole("button", {
      name: `Signal - Traffic 9001: ${locationName}`,
    })
  ).toBeVisible();
});
