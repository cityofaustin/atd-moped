import { fetchAuthSession } from "aws-amplify/auth";
import {
  getCognitoIdJwt,
  getHighestRole,
  type MopedAuthSession,
} from "src/auth/claims";

/**
 * Returns a valid Cognito session to provide roles and id token to
 * Apollo Client GraphQL requests and Moped API requests.
 */
export const getCognitoSession = async (): Promise<MopedAuthSession | null> => {
  try {
    const session = await fetchAuthSession();

    // Assert that any session we return has Hasura claims. getHighestRole
    // returns null if they're missing and AuthProvider signs the user out.
    return session.tokens ? (session as MopedAuthSession) : null;
  } catch (err) {
    console.error("Error getting Cognito session: ", err);
    return null;
  }
};

type RequestAuth = {
  /* The JWT token for the request */
  token: string;
  /* The role associated with the JWT token for the request */
  role: string;
};

/**
 * Token and role for a single outgoing request.
 */
export const getRequestAuth = async (): Promise<RequestAuth | null> => {
  const session = await getCognitoSession();
  if (!session) return null;

  const token = getCognitoIdJwt(session);
  const role = getHighestRole(session);
  if (!token || !role) return null;

  return { token, role };
};
