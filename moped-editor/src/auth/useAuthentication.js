import React, { useCallback, useState } from "react";
import { Auth } from "aws-amplify";

function epochToCentralTime(epochTimestamp) {
  const date = new Date(epochTimestamp * 1000);
  return date.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/** * Get the Cognito ID JWT from a Cognito session.
 *
 * @param {CognitoUserSession} session - The Cognito user session.
 * @returns {string} The ID JWT token.
 */
export const getCognitoIdJwt = (session) =>
  session?.idToken ? session.idToken.getJwtToken() : null;

/**
 * For reference, see @0xdevalias's post:
 * https://github.com/aws-amplify/amplify-js/issues/5284#issuecomment-609012204
 *
 * Handle user authentication and related features.
 *
 * @returns {{
 *   isAuthenticated: boolean,
 *   user: CognitoUser,
 *   error: any,
 *   signIn: function,
 *   signOut: function,
 *   SignInButton: React.Component,
 * }}
 *
 * @see https://aws-amplify.github.io/amplify-js/api/classes/authclass.html
 * @see https://aws-amplify.github.io/amplify-js/api/classes/hubclass.html
 * @see https://aws-amplify.github.io/docs/js/hub#listening-authentication-events
 * @see https://github.com/aws-amplify/amplify-js/blob/master/packages/amazon-cognito-identity-js/src/CognitoUser.js
 */
const useAuthentication = () => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Returns a valid Cognito session to provide valid roles and id JWT to
   * Apollo Client GraphQL requests and Moped API requests.
   *
   * @returns {Promise<CognitoUserSession|null>} A valid Cognito session or null
   */
  const getCognitoSession = useCallback(async () => {
    try {
      const session = await Auth.currentSession();
      setError(null);
      setIsLoading(false);

      console.log("User session refreshed:", session);
      console.log(
        "Token expires:",
        epochToCentralTime(session?.idToken?.payload.exp)
      );

      return session;
    } catch (err) {
      setError(err);
      setIsLoading(false);

      return null;
    }
  }, []);

  /**
   * Sign in the user using Azure AD.
   *
   * @returns {Promise<void>}
   */
  const signIn = useCallback(async () => {
    setIsLoading(true);
    await Auth.federatedSignIn({ provider: "AzureAD" }).catch((err) => {
      setError(err);
    });
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    signIn,
    getCognitoSession,
  };
};

export default useAuthentication;
