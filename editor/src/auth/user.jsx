import { createContext, useContext, useMemo } from "react";

import config from "../config";
import { nonLoginUserRole } from "src/views/staff/helpers";

import { ACCOUNT_USER_PROFILE_GET_PLAIN } from "src/queries/account";

// Create a context that will hold the values that we are going to expose to our components.
// Don't worry about the `null` value. It's gonna be *instantly* overridden by the component below
export const UserContext = createContext(null);

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

/** Get the Cognito ID JWT from a Cognito session.
 *
 * @param {CognitoUserSession} session - The Cognito user session.
 * @returns {string} The ID JWT token.
 */
export const getCognitoIdJwt = (session) =>
  session?.idToken ? session.idToken.getJwtToken() : null;

/**
 * Custom hook that memoizes the session database data
 * This prevents unnecessary re-renders when the data hasn't changed
 * @return {Object} The memoized session database data
 */
export const useSessionDatabaseData = () => {
  return useMemo(() => getSessionDatabaseData(), []);
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

// We also create a simple custom hook to read these values from. We want our React components
// to know as little as possible on how everything is handled, so we are not only abstracting them from
// the fact that we are using React's context, but we also skip some imports.
export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error(
      "`useUser` hook must be used within a `UserProvider` component"
    );
  }
  return context;
};

/** Retrieves the Hasura claims from the Cognito user session.
 * @param {Object} user - The id token payload containing ID token and claims.
 * @returns {Object|null} The Hasura claims or null if not found.
 */
export const getHasuraClaims = (user) => {
  try {
    return JSON.parse(user.idToken.payload["https://hasura.io/jwt/claims"]);
  } catch {
    return null;
  }
};

/**
 * Retrieves the database ID from the Cognito user session.
 * @param {object} user - The Cognito user session containing ID token and claims.
 * @returns {string|null} The database ID or null if not found.
 */
export const getDatabaseId = (user) => {
  try {
    const claims = getHasuraClaims(user);
    return claims["x-hasura-user-db-id"];
  } catch (e) {
    console.error("getDatabaseId error ", e);
    return null;
  }
};

/**
 * Find the highest role in user roles for UI permissions
 * @param {array} roles - Array of user roles
 * @return {string} Highest user role
 */
export const findHighestRole = (roles) => {
  if (roles === null) return null;

  const findRole = (role) => roles.includes(role) && roles;

  switch (roles) {
    case findRole("moped-admin"):
      return "moped-admin";
    case findRole("moped-editor"):
      return "moped-editor";
    case findRole("moped-viewer"):
      return "moped-viewer";
    case findRole(nonLoginUserRole):
      return nonLoginUserRole;
    default:
  }
};

/**
 * Get the role with the highest permissions level from Cognito user session.
 * @param {object} user - Cognito User session containing roles in the token
 * @return {string} Highest user role
 */
export const getHighestRole = (user) => {
  const claims = user.idToken.payload["https://hasura.io/jwt/claims"];

  const allowedRoles = JSON.parse(claims)["x-hasura-allowed-roles"];

  return findHighestRole(allowedRoles);
};
