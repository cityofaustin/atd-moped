import { expect, test } from "@playwright/test";
import { adminGql, createProject, PHASE_IDS } from "../support/hasura";

const insertCompletePhase = (
  projectId: number,
  phase: Record<string, unknown>
) =>
  adminGql(
    `mutation AddCompletePhase($object: moped_proj_phases_insert_input!) {
      insert_moped_proj_phases_one(object: $object) { project_phase_id }
    }`,
    {
      object: { project_id: projectId, phase_id: PHASE_IDS.complete, ...phase },
    }
  );

const getCompletionDates = async (projectId: number) => {
  const { project_list_view } = await adminGql<{
    project_list_view: {
      substantial_completion_date: string | null;
      substantial_completion_date_estimated: string | null;
    }[];
  }>(
    `query CompletionDates($projectId: Int!) {
      project_list_view(where: { project_id: { _eq: $projectId } }) {
        substantial_completion_date
        substantial_completion_date_estimated
      }
    }`,
    { projectId }
  );
  return project_list_view[0];
};

/* QA sheet row 57 */
test.describe("project_list_view substantial completion date", () => {
  test("uses the earliest confirmed date of a Complete phase", async () => {
    const { projectId } = await createProject("DB completion confirmed");
    await insertCompletePhase(projectId, {
      phase_start: "2025-03-10",
      is_phase_start_confirmed: true,
      phase_end: "2025-04-20",
      is_phase_end_confirmed: true,
    });

    const dates = await getCompletionDates(projectId);

    expect(dates.substantial_completion_date?.slice(0, 10)).toBe("2025-03-10");
    expect(dates.substantial_completion_date_estimated).toBeNull();
  });

  test("uses the estimated date until one is confirmed", async () => {
    const { projectId } = await createProject("DB completion estimated");
    await insertCompletePhase(projectId, {
      phase_start: "2025-06-15",
      is_phase_start_confirmed: false,
    });

    const dates = await getCompletionDates(projectId);

    expect(dates.substantial_completion_date).toBeNull();
    expect(dates.substantial_completion_date_estimated?.slice(0, 10)).toBe(
      "2025-06-15"
    );
  });
});
