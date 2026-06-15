import { requireEnv } from "./env.ts";

const HASURA_ENDPOINT = requireEnv("HASURA_ENDPOINT");
const HASURA_ADMIN_SECRET = requireEnv("HASURA_ADMIN_SECRET");

export const addProject = `
mutation AddProject($object: moped_project_insert_input!) {
  insert_moped_project_one(object: $object) {
      project_id
  }
}
`;

export async function makeHasuraRequest<T>(
  query: string,
  payload?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(HASURA_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hasura-admin-secret": HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({ query, ...(payload ? { variables: payload } : {}) }),
  });

  if (!res.ok) {
    throw new Error(`Hasura request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (data.errors) {
    throw new Error(`Hasura errors: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}
