import { expect } from "@playwright/test";
import { testUsers } from "./testUsers";

const hasuraUrl = process.env.E2E_HASURA_URL ?? "http://localhost:8082";
/* The local stack's admin secret from database/docker-compose.yml, not a real credential */
const adminSecret = process.env.E2E_HASURA_ADMIN_SECRET ?? "hasurapassword";

/** Run a GraphQL request against the local Hasura with the admin secret */
export const adminGql = async <T = Record<string, never>>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> => {
  const response = await fetch(`${hasuraUrl}/v1/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": adminSecret,
    },
    body: JSON.stringify({ query, variables }),
  });
  const { data, errors } = await response.json();
  if (errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(errors)}`);
  }
  return data as T;
};

/** A name no other test run has used, so tests don't depend on each other */
export const uniqueName = (prefix: string) =>
  `${prefix} ${Date.now()}-${Math.floor(Math.random() * 10_000)}`;

/** Phase IDs from the moped_phases seed data */
export const PHASE_IDS = { potential: 1, construction: 9, complete: 11 };

/**
 * Insert a project in the Potential phase, like the New Project page does.
 * @returns the new project's ID and name
 */
export const createProject = async (prefix = "E2E project") => {
  const projectName = uniqueName(prefix);
  const data = await adminGql<{
    insert_moped_project_one: { project_id: number };
  }>(
    `mutation CreateProject($object: moped_project_insert_input!) {
      insert_moped_project_one(object: $object) { project_id }
    }`,
    {
      object: {
        project_name: projectName,
        project_description: `Description for ${projectName}`,
        added_by: testUsers.editor.userId,
        moped_proj_phases: {
          data: [
            {
              phase_id: PHASE_IDS.potential,
              is_current_phase: true,
              phase_start: new Date().toISOString(),
              is_phase_start_confirmed: true,
            },
          ],
        },
      },
    }
  );
  return {
    projectId: data.insert_moped_project_one.project_id,
    projectName,
  };
};

type ActivityEntry = {
  record_id: number;
  operation_type: string;
  record_data: {
    event: { data: { new: Record<string, unknown> | null } };
  };
};

/**
 * Hasura writes the activity log asynchronously through event triggers, so
 * poll until an entry matches.
 */
export const waitForActivity = async ({
  projectId,
  recordType,
  matches = () => true,
  timeout = 30_000,
}: {
  projectId: number;
  recordType: string;
  matches?: (entry: ActivityEntry) => boolean;
  timeout?: number;
}) => {
  await expect
    .poll(
      async () => {
        const { moped_activity_log } = await adminGql<{
          moped_activity_log: ActivityEntry[];
        }>(
          `query ProjectActivity($projectId: Int!, $recordType: String!) {
            moped_activity_log(
              where: {
                record_project_id: { _eq: $projectId }
                record_type: { _eq: $recordType }
              }
            ) {
              record_id
              operation_type
              record_data
            }
          }`,
          { projectId, recordType }
        );
        return moped_activity_log.some(matches);
      },
      {
        message: `activity log entry for ${recordType} on project ${projectId}`,
        timeout,
      }
    )
    .toBe(true);
};
