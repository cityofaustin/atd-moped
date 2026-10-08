import {
  getCognitoIdJwt,
  getDatabaseId,
  getHighestRole,
  type MopedAuthSession,
} from "src/auth/claims";
import { GET_ACCOUNT_USER_PROFILE } from "src/queries/account";
import config from "src/config";
import { print } from "graphql";
import type { GetUserProfileQuery } from "src/gql/graphql";

export type MopedUser = GetUserProfileQuery["moped_users"][0];

/**
 * Fetches the user Postgres database row from Hasura
 * @param session - The Cognito user session.
 * @return The user database row
 */
export const fetchMopedUser = async (session: MopedAuthSession) => {
  const token = getCognitoIdJwt(session);

  // If the session is valid, fetch the data from Hasura
  try {
    const res = await fetch(config.env.APP_HASURA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Hasura-Role": `${getHighestRole(session)}`,
      },
      body: JSON.stringify({
        query: print(GET_ACCOUNT_USER_PROFILE),
        variables: {
          userId: getDatabaseId(session),
        },
      }),
    });

    const resData = (await res.json()) as {
      data?: GetUserProfileQuery;
      errors?: unknown[];
    };

    if (resData.errors) {
      throw new Error("Error fetching user data");
    }

    const userData = resData.data?.moped_users?.[0];
    if (!userData) {
      throw new Error("No user data found");
    }

    return userData;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};
