import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { Auth, Hub } from "aws-amplify";
import { signInButton, signInButtonContent } from "@aws-amplify/ui";

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

  const refreshState = useCallback(() => {
    setIsLoading(true);

    Auth.currentSession()
      .then(user => {
        setUser(user);
        setIsAuthenticated(_isAuthenticated(user));
        setError(null);
        setIsLoading(false);
      })
      .catch(err => {
        setUser(null);
        setIsAuthenticated(false);
        if (err === "not authenticated") {
          setError(null);
        } else {
          setError(err);
        }
        setIsLoading(false);
      });
  }, []);

  // Make sure our state is loaded before first render
  useLayoutEffect(() => {
    refreshState();
  }, [refreshState]);

  // Subscribe to auth events
  useEffect(() => {
    const handler = ({ payload }) => {
      switch (payload.event) {
        case "configured":
        case "signIn":
        case "signIn_failure":
        case "signOut":
          refreshState();
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
    Auth.federatedSignIn({ provider: "AzureAD" }).catch(err => {
      setError(err);
    });
  }, []);

  const signOut = useCallback(() => {
    Auth.signOut()
      .then(_ => {
        refreshState();
      })
      .catch(err => {
        setError(err);
      });
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
  };
};

const _isAuthenticated = user => {
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
