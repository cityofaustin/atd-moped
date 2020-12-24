import React from "react";
import Amplify, { Auth } from "aws-amplify";

// Create a context that will hold the values that we are going to expose to our components.
// Don't worry about the `null` value. It's gonna be *instantly* overriden by the component below
export const UserContext = React.createContext(null);

// Create a "controller" component that will calculate all the data that we need to give to our
// components bellow via the `UserContext.Provider` component. This is where the Amplify will be
// mapped to a different interface, the one that we are going to expose to the rest of the app.
export const UserProvider = ({ children }) => {
  /**
   * Retrieves persisted user context object
   * @return {object}
   */
  const getPersistedContext = () => {
    return JSON.parse(localStorage.getItem("atd_moped_user_context")) || null;
  };

  /**
   * Persists user context object into localstorage
   * @param {str} context - The user context object
   */
  const setPersistedContext = context => {
    localStorage.setItem("atd_moped_user_context", JSON.stringify(context));
  };

  const [user, setUser] = React.useState(getPersistedContext());
  const [loginLoading, setLoginLoading] = React.useState(false);

  React.useEffect(() => {
    // Configure the keys needed for the Auth module. Essentially this is
    // like calling `Amplify.configure` but only for `Auth`.
    /**
     * AWS Amplify
     * @see https://github.com/aws-amplify/amplify-js
     */

    Amplify.Logger.LOG_LEVEL = "DEBUG";

    // attempt to fetch the info of the user that was already logged in
    Auth.currentAuthenticatedUser()
      .then(user => {
        setPersistedContext(user);
        setUser(getPersistedContext());
      })
      .catch(() => {
        setPersistedContext(null);
        setUser(null);
      });
  }, []);

  // We make sure to handle the user update here, but return the resolve value in order for our components to be
  // able to chain additional `.then()` logic. Additionally, we `.catch` the error and "enhance it" by providing
  // a message that our React components can use.
  const login = (usernameOrEmail, password) => {
    setLoginLoading(true);

    return Auth.signIn(usernameOrEmail, password)
      .then(cognitoUser => {
        setUser(cognitoUser);
        setLoginLoading(false);
        return cognitoUser;
      })
      .catch(err => {
        if (err.code === "UserNotFoundException") {
          err.message = "Invalid username or password";
        }

        // ... (other checks)
        setLoginLoading(false);
        throw err;
      });
  };

  // same thing here
  const logout = () =>
    Auth.signOut().then(data => {
      setUser(null);
      return data;
    });

  const isUserSSO = () =>
    user.signInUserSession.idToken.payload["cognito:username"].startsWith(
      "azuread_"
    );

  // Make sure to not force a re-render on the components that are reading these values,
  // unless the `user` value has changed. This is an optimisation that is mostly needed in cases
  // where the parent of the current component re-renders and thus the current component is forced
  // to re-render as well. If it does, we want to make sure to give the `UserContext.Provider` the
  // same value as long as the user data is the same. If you have multiple other "controller"
  // components or Providers above this component, then this will be a performance booster.
  const values = React.useMemo(
    () => ({ user, login, logout, loginLoading, isUserSSO }),
    [user, loginLoading]
  );

  // Finally, return the interface that we want to expose to our other components
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

// We also create a simple custom hook to read these values from. We want our React components
// to know as little as possible on how everything is handled, so we are not only abtracting them from
// the fact that we are using React's context, but we also skip some imports.
export const useUser = () => {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw new Error(
      "`useUser` hook must be used within a `UserProvider` component"
    );
  }
  return context;
};

export const getJwt = user => {
  return user.signInUserSession.idToken.jwtToken;
};

// This function takes a CognitoUser Object and returns the role with the
// highest permissions level within their allowed roles.
export const getHighestRole = user => {
  const claims =
    user.signInUserSession.idToken.payload["https://hasura.io/jwt/claims"];

  const allowedRoles = JSON.parse(claims)["x-hasura-allowed-roles"];

  const findRole = role => {
    if (allowedRoles.includes(role)) {
      return allowedRoles;
    }
  };

  switch (allowedRoles) {
    case findRole("moped-admin"):
      return "moped-admin";
    case findRole("moped-editor"):
      return "moped-editor";
    case findRole("moped-viewer"):
      return "moped-viewer";
    default:
  }
};
