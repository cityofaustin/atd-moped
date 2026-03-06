import { requireEnv } from "./env.ts";

const HASURA_ENDPOINT = requireEnv("HASURA_ENDPOINT");
const HASURA_ADMIN_SECRET = requireEnv("HASURA_ADMIN_SECRET");

/**
 * Query for new install PHBs that have completion date and Complete or Post-construction phase
 */
export const getCompletedPhbComponents = `
query GetCompletedPhbComponents {
  moped_proj_components(
    where: {
      component_id: { _eq: 16 }
      is_deleted: { _eq: false }
      completion_date: { _is_null: false }
      phase_id: { _in: [7, 11] }
      moped_project: { is_deleted: { _eq: false } }
      moped_proj_component_work_types: {
        work_type_id: { _eq: 7 }
        is_deleted: { _eq: false }
      }
      feature_signals: {
        is_deleted: { _eq: false }
        signal_type: { _ilike: "phb" }
      }
    }
  ) {
    project_id
    project_component_id
    phase_id
    completion_date
    feature_signals(
      where: { is_deleted: { _eq: false }, signal_type: { _ilike: "phb" } }
    ) {
      signal_id
      location_name
    }
  }
}
`;

/**
 * Query for new install PHBs that have Complete or Post-construction phase but are missing completion date
 */
// https://localhost:3000/moped/projects/2260?tab=map&project_component_id=3288
export const getCompletedPhbComponentsNeedingDateOnly = `
query GetPhbComponentsMissingCompletionDate {
  moped_proj_components(
    where: {
      component_id: { _eq: 16 }
      is_deleted: { _eq: false }
      completion_date: { _is_null: true }
      phase_id: { _in: [7, 11] }
      moped_project: { is_deleted: { _eq: false } }
      moped_proj_component_work_types: {
        work_type_id: { _eq: 7 }
        is_deleted: { _eq: false }
      }
      feature_signals: {
        is_deleted: { _eq: false }
        signal_type: { _ilike: "phb" }
      }
    }
  ) {
    project_id
    project_component_id
    phase_id
    completion_date
    feature_signals(
      where: { is_deleted: { _eq: false }, signal_type: { _ilike: "phb" } }
    ) {
      signal_id
      location_name
    }
  }
}`;

/**
 * Query for new install PHBs that are missing both completion date and phase
 */
// https://localhost:3000/moped/projects/99?tab=summary
export const getCompletedPhbComponentsNeedingPhaseAndDate = `
query GetNewPhbComponentsMissingPhaseAndCompletionDate {
  moped_proj_components(
    where: {
      component_id: { _eq: 16 }
      is_deleted: { _eq: false }
      completion_date: { _is_null: true }
      phase_id: { _is_null: true }
      moped_project: { is_deleted: { _eq: false } }
      moped_proj_component_work_types: {
        work_type_id: { _eq: 7 }
        is_deleted: { _eq: false }
      }
      feature_signals: {
        is_deleted: { _eq: false }
        signal_type: { _ilike: "phb" }
      }
    }
  ) {
    project_id
    project_component_id
    phase_id
    completion_date
    feature_signals(
      where: { is_deleted: { _eq: false }, signal_type: { _ilike: "phb" } }
    ) {
      signal_id
      location_name
    }
  }
}
`;

export const updateMopedComponentCompletionDate = `
mutation UpdateMopedComponentCompletionDate($id: Int!, $completion_date: timestamptz!) {
  update_moped_proj_components_by_pk(pk_columns: {project_component_id: $id}, _set: {completion_date: $completion_date, updated_by_user_id: 1}) {
    project_component_id
    project_id
  }
}
`;

export const updateMopedComponentCompletionDateAndPhase = `
mutation UpdateMopedComponentCompletionDateAndPhase($id: Int!, $completion_date: timestamptz!) {
  update_moped_proj_components_by_pk(pk_columns: {project_component_id: $id}, _set: {completion_date: $completion_date, phase_id: 11}) {
    project_component_id
    project_id
  }
}
`;

export const addProject = `
mutation AddProject($object: moped_project_insert_input!) {
  insert_moped_project_one(object: $object) {
      project_id
  }
}
`;

export async function makeHasuraRequest<T>(
  query: string,
  payload?: Record<string, any>,
): Promise<T> {
  const res = await fetch(HASURA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, ...(payload ? { variables: payload } : {}) }),
  });

  const data = await res.json();
  if (data.errors) {
    throw new Error(`Hasura errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}
