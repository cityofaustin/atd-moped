import { useMemo } from "react";
import {
  getCognitoIdJwt,
  getDatabaseId,
  getHighestRole,
} from "src/auth/claims";
import { ACCOUNT_USER_PROFILE_GET_PLAIN } from "src/queries/account";
import config from "src/config";

/**
 * This is a constant string key that holds the profile for a user.
 * @type {string}
 * @constant
 */
export const atdSessionDatabaseDataKeyName = "atd_moped_user_db_data";

/**
 * Parses the user Postgres database row from localStorage
 * @return {Object}
 */
export const getSessionDatabaseData = () => {
  const storedData = localStorage.getItem(atdSessionDatabaseDataKeyName);
  if (storedData === "undefined" || storedData === null) {
    return null;
  }
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing session database data:", error);
    return null;
  }
};

/**
 * Retrieves the user Postgres database row from Hasura
 * @param {Object} session - The Cognito user session.
 * @return {Object} The user database row
 */
export const initializeUserDBObject = async (session) => {
  const token = getCognitoIdJwt(session);
  // Retrieve the data from local storage (if any)
  const sessionDataFromLocalStorage = getSessionDatabaseData();

  // If the session is valid and there is no existing data...
  if (!sessionDataFromLocalStorage) {
    // Fetch the data from Hasura
    try {
      const res = await fetch(config.env.APP_HASURA_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Hasura-Role": `${getHighestRole(session)}`,
        },
        body: JSON.stringify({
          query: ACCOUNT_USER_PROFILE_GET_PLAIN,
          variables: {
            userId: getDatabaseId(session),
          },
        }),
      });

      const resData = await res.json();

      if (resData?.errors) {
        // Show error feedback in sign in form
        throw new Error("Error fetching user data");
      }

      if (resData?.data?.moped_users) {
        const userData = resData.data.moped_users[0];
        return userData;
      }

      throw new Error("No user data found");
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  } else {
    return sessionDataFromLocalStorage;
  }
};

/**
 * Persists the user Postgres database row into localStorage
 * @param userObject
 */
export const setSessionDatabaseData = (userObject) =>
  localStorage.setItem(
    atdSessionDatabaseDataKeyName,
    JSON.stringify(userObject)
  );

/**
 * Deletes the user Postgres database row from localStorage
 */
export const deleteSessionDatabaseData = () =>
  localStorage.removeItem(atdSessionDatabaseDataKeyName);

/**
 * Custom hook that memoizes the session database data
 * This prevents unnecessary re-renders when the data hasn't changed
 * @return {Object} The memoized session database data
 */
export const useSessionDatabaseData = () => {
  return useMemo(() => getSessionDatabaseData(), []);
};
