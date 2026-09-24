import { Auth } from "aws-amplify";
import { getCognitoIdJwt, getHighestRole } from "src/auth/claims";

/**
 * Returns a valid Cognito session to provide roles and id token to
 * Apollo Client GraphQL requests and Moped API requests.
 */
export const getCognitoSession = async () => {
  try {
    const session = await Auth.currentSession();

    return session;
  } catch (err) {
    console.error("Error getting Cognito session: ", err);
    return null;
  }
};

/**
 * Token and role for a single outgoing request.
 * @return {Promise<{token: string, role: string}|null>} Null when unauthenticated
 */
export const getRequestAuth = async () => {
  const session = await getCognitoSession();
  if (!session) return null;

  const token = getCognitoIdJwt(session);
  const role = getHighestRole(session);
  if (!token || !role) return null;

  return { token, role };
};
