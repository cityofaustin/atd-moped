import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { Auth, Hub } from "aws-amplify";
import { signInButton, signInButtonContent } from "@aws-amplify/ui";

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
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Checks the current Cognito session and updates the user state. A loading
   * state is set while the session is being checked.
   */
  const refreshState = useCallback(async () => {
    setIsLoading(true);

    try {
      const user = await Auth.currentSession();
      setUser(user);
      setIsAuthenticated(_isAuthenticated(user));
      setError(null);
      setIsLoading(false);

      return user;
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      if (err === "not authenticated") {
        setError(null);
      } else {
        setError(err);
      }
      setIsLoading(false);

      return null;
    }
  }, []);

  // Make sure our state is loaded before first render
  useLayoutEffect(() => {
    const refreshUserState = async () => {
      await refreshState();
    };
    refreshUserState();
  }, [refreshState]);

  // Subscribe to auth events
  useEffect(() => {
    const handler = async ({ payload }) => {
      console.log("Auth event payload: ", payload);
      switch (payload.event) {
        case "configured":
        case "signIn":
        case "signIn_failure":
        case "signOut":
          await refreshState();
          break;

        default:
          break;
      }
    };

    Hub.listen("auth", handler);

    return () => {
      Hub.remove("auth", handler);
    };
  }, [refreshState]);

  const signIn = useCallback(() => {
    setIsLoading(true);
    Auth.federatedSignIn({ provider: "AzureAD" }).catch((err) => {
      setError(err);
    });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await Auth.signOut();
      await refreshState();
    } catch (err) {
      setError(err);
    }
  }, [refreshState]);

  /**
   * Returns a valid JWT token to use against the GraphQL endpoint or the
   * Moped API.
   */
  const getToken = useCallback(async () => {
    const currentUser = await refreshState();
    console.log("User session refreshed:", currentUser);
    console.log(
      "Expires:",
      epochToCentralTime(currentUser?.idToken?.payload.exp)
    );
    return currentUser?.idToken?.getJwtToken();
  }, [refreshState]);

  const CognitoSignInButton = useCallback(
    ({ label = "Sign In" }) => (
      <button className={signInButton} onClick={signIn}>
        <span className={signInButtonContent}>{label}</span>
      </button>
    ),
    [signIn]
  );

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    signIn,
    signOut,
    SignInButton: CognitoSignInButton,
    getToken,
  };
};

const _isAuthenticated = (user) => {
  if (
    !user ||
    !user.idToken ||
    !user.idToken.payload ||
    !user.idToken.payload["https://hasura.io/jwt/claims"] ||
    !user.accessToken ||
    !user.refreshToken
  ) {
    return false;
  }
  const isValid = user?.isValid() ?? false;

  const isExpired =
    Math.round(new Date().getTime() / 1000) > user.idToken.getExpiration();

  return isValid && !isExpired;
};

export default useAuthentication;
