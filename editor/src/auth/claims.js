import { nonLoginUserRole } from "src/views/staff/helpers";

export const ROLE_ORDER = [
  "moped-admin",
  "moped-editor",
  "moped-viewer",
  nonLoginUserRole,
];

/** Get the Cognito ID JWT from a Cognito session.
 *
 * @param {CognitoUserSession} session - The Cognito user session.
 * @returns {string} The ID JWT token.
 */
export const getCognitoIdJwt = (session) =>
  session?.idToken ? session.idToken.getJwtToken() : null;

/** Retrieves the Hasura claims from the Cognito session.
 * @param {Object} session - The Cognito session
 * @returns {Object|null} The Hasura claims or null if not found.
 */
export const getHasuraClaims = (session) => {
  try {
    return JSON.parse(session.idToken.payload["https://hasura.io/jwt/claims"]);
  } catch {
    return null;
  }
};

/**
 * Retrieves the database ID from the Cognito user session.
 * @param {object} user - The Cognito user session containing ID token and claims.
 * @returns {string|null} The database ID or null if not found.
 */
export const getDatabaseId = (session) => {
  const claims = getHasuraClaims(session);
  return claims?.["x-hasura-user-db-id"] ?? null;
};

/**
 * Find the highest role in user roles for UI permissions
 * @param {array|null} roles - Array of user roles
 * @return {string|null} Highest user role
 */
export const findHighestRole = (roles) => {
  if (!roles) return null;
  return ROLE_ORDER.find((role) => roles.includes(role)) ?? null;
};

/**
 * Get the role with the highest permissions level from Cognito session.
 * @param {object} session - Cognito session containing roles in the token
 * @return {string|null} Highest user role
 */
export const getHighestRole = (session) => {
  const claims = getHasuraClaims(session);
  if (!claims) return null;

  return findHighestRole(claims["x-hasura-allowed-roles"]);
};
