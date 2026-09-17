import { nonLoginUserRole } from "src/views/staff/helpers";
import type { AuthSession, JWT } from "aws-amplify/auth";

/**
 * Extended Cognito Auth Session that includes the Hasura claims added by our pre-token lambda.
 */
type MopedAuthSession = AuthSession & {
  tokens: NonNullable<AuthSession["tokens"]> & {
    idToken: JWT & {
      payload: JWT["payload"] & {
        "https://hasura.io/jwt/claims": string;
      };
    };
  };
};

export const ROLE_ORDER = [
  "moped-admin",
  "moped-editor",
  "moped-viewer",
  nonLoginUserRole,
];

/** Get the Cognito ID JWT from a Cognito session.
 *
 * @param session - The Cognito user session.
 * @returns The ID JWT token.
 */
export const getCognitoIdJwt = (session: MopedAuthSession | null) =>
  session?.tokens?.idToken?.toString() ?? null;

/** Retrieves the Hasura claims from the Cognito session.
 * @param session - The Cognito session
 * @returns The Hasura claims or null if not found.
 */
export const getHasuraClaims = (session: MopedAuthSession) => {
  const rawHasuraClaims =
    session?.tokens?.idToken?.payload["https://hasura.io/jwt/claims"];
  if (typeof rawHasuraClaims !== "string") return null;
  try {
    return JSON.parse(rawHasuraClaims);
  } catch {
    return null;
  }
};

/**
 * Retrieves the database ID from the Cognito user session.
 * @param user - The Cognito user session containing ID token and claims.
 */
export const getDatabaseId = (session: MopedAuthSession) => {
  const claims = getHasuraClaims(session);
  return claims?.["x-hasura-user-db-id"] ?? null;
};

/**
 * Find the highest role in user roles for UI permissions
 * @param roles - Array of user roles
 * @returns The highest role from the array or null if not found.
 */
export const findHighestRole = (roles: string[] | null) => {
  if (!roles) return null;
  return ROLE_ORDER.find((role) => roles.includes(role)) ?? null;
};

/**
 * Get the role with the highest permissions level from Cognito session.
 * @param session - Cognito session containing roles in the token
 * @returns The highest user role or null if not found.
 */
export const getHighestRole = (session: MopedAuthSession) => {
  const claims = getHasuraClaims(session);
  if (!claims) return null;

  return findHighestRole(claims["x-hasura-allowed-roles"]);
};
