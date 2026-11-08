import { expect, test } from "@playwright/test";
import { createProject, waitForActivity } from "../support/hasura";

/* QA sheet rows 49, 51 and 60 */
test("change the current phase, delete the old one, and see it in the activity log", async ({
  page,
}) => {
  const { projectId } = await createProject("E2E phases");

  await page.goto(`/moped/projects/${projectId}?tab=timeline`);

  await test.step("add Construction as the current phase", async () => {
    await page.getByRole("button", { name: "Add phase" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox", { name: "Phase", exact: true }).click();
    await page
      .getByRole("option", { name: "Construction", exact: true })
      .click();
    await dialog
      .getByRole("button", { name: "Save and mark as current" })
      .click();
    await expect(dialog).toBeHidden();
  });

  await test.step("the status badge says Construction", async () => {
    await expect(
      page.locator(".MuiChip-root", { hasText: "Construction" })
    ).toBeVisible();
  });

  await test.step("delete the old Potential phase", async () => {
    await page
      .getByRole("row", { name: /Potential/ })
      .getByRole("button", { name: "delete" })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Delete" })
      .click();
    await expect(page.getByText("Project phase deleted")).toBeVisible();
    await expect(page.getByRole("row", { name: /Potential/ })).toBeHidden();
  });

  await test.step("the delete reaches the activity log", async () => {
    /* Written asynchronously by a Hasura event trigger */
    await waitForActivity({
      projectId,
      recordType: "moped_proj_phases",
      matches: (entry) => entry.record_data.event.data.new?.is_deleted === true,
    });

    await page.getByRole("tab", { name: "Activity" }).click();
    await expect(page.getByText("Removed the phase")).toBeVisible();
  });
});
