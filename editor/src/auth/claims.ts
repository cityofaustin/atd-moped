import type { AuthSession, JWT } from "aws-amplify/auth";

// Key for accessing Hasura claims in the JWT payload set by our Cognito pre-token Lambda.
const HASURA_CLAIMS_KEY = "https://hasura.io/jwt/claims";

/**
 * Extended Cognito Auth Session that includes the Hasura claims added by our pre-token lambda.
 */
type MopedAuthSession = AuthSession & {
  tokens: NonNullable<AuthSession["tokens"]> & {
    idToken: JWT & {
      payload: JWT["payload"] & {
        [HASURA_CLAIMS_KEY]: string;
      };
    };
  };
};

/**
 * The Hasura claims the app reads that were added by our Cognito pre-token Lambda.
 * See auth/cognito-pre-token-hook/README.md for more details.
 */
type HasuraClaims = {
  "x-hasura-allowed-roles": string[];
  "x-hasura-user-db-id": string;
};

export const nonLoginUserRole = "non-login-user";

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
export const getHasuraClaims = (session: MopedAuthSession | null) => {
  const rawHasuraClaims = session?.tokens?.idToken?.payload[HASURA_CLAIMS_KEY];
  if (typeof rawHasuraClaims !== "string") return null;
  try {
    return JSON.parse(rawHasuraClaims) as HasuraClaims;
  } catch {
    return null;
  }
};

/**
 * Retrieves the database ID from the Cognito user session.
 * @param session - The Cognito user session containing ID token and claims.
 */
export const getDatabaseId = (session: MopedAuthSession | null) => {
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
export const getHighestRole = (session: MopedAuthSession | null) => {
  const claims = getHasuraClaims(session);
  if (!claims) return null;

  return findHighestRole(claims["x-hasura-allowed-roles"]);
};
