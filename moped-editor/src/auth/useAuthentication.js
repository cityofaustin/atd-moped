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
  console.log("[AUTH] useAuthentication() start");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshState = useCallback(() => {

    setIsLoading(true);
    console.log("[AUTH] useAuthentication() refresh state");

    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log("[AUTH] useAuthentication().currentAuthenticatedUser().then() setting user state");
        setUser(user);
        setIsAuthenticated(_isAuthenticated(user));
        setError(null);
        setIsLoading(false);
      })
      .catch(err => {
        console.log("[AUTH] useAuthentication().currentAuthenticatedUser().catch() error");
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
    console.log("[AUTH] useLayoutEffect() refreshing state");
    refreshState();
  }, [refreshState]);

  // Subscribe to auth events
  useEffect(() => {
    console.log("[AUTH] useEffect() Subscribe to auth events");
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
    console.log("[AUTH] signIn() signing in");
    setIsLoading(true);
    Auth.federatedSignIn({ provider: "AzureAD" }).then(_ => {
      console.log("[AUTH] Auth.federatedSignIn().signIn() signing in");
    }).catch(err => {
      console.log("[AUTH] Auth.federatedSignIn().signIn() error");
      setError(err);
    });
  }, []);

  const signOut = useCallback(() => {
    console.log("[AUTH] signIn() signing out");
    Auth.signOut()
      .then(_ => {
        console.log("[AUTH] signOut().Auth.signOut() success...");
        refreshState();
      })
      .catch(err => {
        console.log("[AUTH] signOut().Auth.signOut() error...");
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

  console.log("_isAuthenticated: debugging..."); debugger;


  if (
    !user ||
    !user.signInUserSession ||
    !user.signInUserSession.isValid ||
    !user.signInUserSession.accessToken ||
    !user.signInUserSession.accessToken.getExpiration
  ) {
    console.log("[AUTH] _isAuthenticated() not signed in!");
    return false;
  }

  console.log("[AUTH] _isAuthenticated() checking things...");
  const session = user.signInUserSession;
  const isValid = session.isValid() || false;

  const sessionExpiry = new Date(session.accessToken.getExpiration() * 1000);
  const isExpired = new Date() > sessionExpiry;
  const output = isValid && !isExpired;
  console.log("[AUTH] _isAuthenticated() checking things: " + output);
  return output;
};


export default useAuthentication;
