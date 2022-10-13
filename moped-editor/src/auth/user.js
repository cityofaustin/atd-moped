import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import Amplify, { Auth } from "aws-amplify";

import { colors } from "@material-ui/core";

import config from "../config";
import { nonLoginUserRole } from "src/views/staff/helpers";

import { ACCOUNT_USER_PROFILE_GET_PLAIN } from "../queries/account";

// Create a context that will hold the values that we are going to expose to our components.
// Don't worry about the `null` value. It's gonna be *instantly* overridden by the component below
export const UserContext = createContext(null);

/**
 * This is a constant string key that holds the profile color for a user.
 * @type {string}
 * @constant
 */
export const atdColorKeyName = "atd_moped_user_color";

/**
 * This is a constant string key that holds the profile for a user.
 * @type {string}
 * @constant
 */
export const atdSessionKeyName = "atd_moped_user_context";

/**
 * This is a constant string key that holds the profile for a user.
 * @type {string}
 * @constant
 */
export const atdSessionDatabaseDataKeyName = "atd_moped_user_db_data";

/**
 * Removes the current user profile color
 */
export const destroyProfileColor = () =>
  localStorage.removeItem(atdColorKeyName);

/**
 * Removes the current profile
 */
export const destroyLoggedInProfile = () =>
  localStorage.removeItem(atdSessionKeyName);

/**
 * Parses the user database data from localStorage
 * @return {Object}
 */
export const getSessionDatabaseData = () => {
  if (localStorage.getItem(atdSessionDatabaseDataKeyName) === "undefined") {
    return null;
  }
  return JSON.parse(localStorage.getItem(atdSessionDatabaseDataKeyName));
};

/**
 * Persists the user database data into localStorage
 * @param userObject
 */
export const setSessionDatabaseData = (userObject) =>
  localStorage.setItem(
    atdSessionDatabaseDataKeyName,
    JSON.stringify(userObject)
  );

/**
 * Deletes the user database data from localStorage
 */
export const deleteSessionDatabaseData = () =>
  localStorage.removeItem(atdSessionDatabaseDataKeyName);

/**
 * Retrieves the user database data from Hasura
 * @param {Object} userObject - The user object as provided by AWS
 */
export const initializeUserDBObject = (userObject) => {
  // Retrieve the data (if any)
  const sessionData = getSessionDatabaseData();

  // If the user object is valid and there is no existing data...
  if (userObject && sessionData === null) {
    // Fetch the data from Hasura
    fetch(config.env.APP_HASURA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getJwt(userObject)}`,
        "X-Hasura-Role": `${getHighestRole(userObject)}`,
      },
      body: JSON.stringify({
        query: ACCOUNT_USER_PROFILE_GET_PLAIN,
        variables: {
          userId:
            config.env.APP_ENVIRONMENT === "local"
              ? 1
              : getDatabaseId(userObject),
        },
      }),
    }).then((res) => {
      // Then we parse the response
      res.json().then((resData) => {
        // If we have any user data,  use it
        if (resData?.data?.moped_users) {
          setSessionDatabaseData(resData.data.moped_users[0]);
          window.location.reload();
        }
      });
    });
  }
};

// Create a "controller" component that will calculate all the data that we need to give to our
// components bellow via the `UserContext.Provider` component. This is where the Amplify will be
// mapped to a different interface, the one that we are going to expose to the rest of the app.
export const UserProvider = ({ children }) => {
  /**
   * Retrieves persisted user context object
   * @return {object}
   */
  const getPersistedContext = () => {
    return JSON.parse(localStorage.getItem(atdSessionKeyName)) || null;
  };

  /**
   * Persists user context object into localstorage
   * @param {str} context - The user context object
   */
  const setPersistedContext = (context) => {
    localStorage.setItem(atdSessionKeyName, JSON.stringify(context));
  };

  const [user, setUser] = useState(getPersistedContext());
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // Configure the keys needed for the Auth module. Essentially this is
    // like calling `Amplify.configure` but only for `Auth`.
    /**
     * AWS Amplify
     * @see https://github.com/aws-amplify/amplify-js
     */

    // Amplify's Logger() class doesn't provide a mechanism to use console.[info|debug|warn, etc.],
    // so we would need to turn this back to DEBUG if we're actively debugging authentication.
    Amplify.Logger.LOG_LEVEL = "INFO";

    Auth.currentSession()
      .then((user) => {
        setPersistedContext(user);
        setUser(user);
      })
      .catch((error) => {
        setPersistedContext(null);
        setUser(null);
      });
  }, []);

  useEffect(() => {
    initializeUserDBObject(user);
  }, [user]);

  // We make sure to handle the user update here, but return the resolve value in order for our components to be
  // able to chain additional `.then()` logic. Additionally, we `.catch` the error and "enhance it" by providing
  // a message that our React components can use.
  const login = (usernameOrEmail, password) => {
    setLoginLoading(true);

    return Auth.signIn(usernameOrEmail, password)
      .then((user) => {
        setUser(user.signInUserSession);
        setLoginLoading(false);
        return user.signInUserSession;
      })
      .catch((err) => {
        if (err.code === "UserNotFoundException") {
          err.message = "Invalid username or password";
        }

        // ... (other checks)
        setLoginLoading(false);
        throw err;
      });
  };

  // same thing here
  const logout = () => {
    destroyProfileColor();
    destroyLoggedInProfile();
    deleteSessionDatabaseData();
    return Auth.signOut().then((data) => {
      // Remove the current color
      setUser(null);
      return data;
    });
  };

  // Make sure to not force a re-render on the components that are reading these values,
  // unless the `user` value has changed. This is an optimization that is mostly needed in cases
  // where the parent of the current component re-renders and thus the current component is forced
  // to re-render as well. If it does, we want to make sure to give the `UserContext.Provider` the
  // same value as long as the user data is the same. If you have multiple other "controller"
  // components or Providers above this component, then this will be a performance booster.
  const values = useMemo(
    () => ({ user, login, logout, loginLoading }),
    [user, loginLoading]
  );

  // Finally, return the interface that we want to expose to our other components
  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

/**
 * Returns a random themes standard color as hexadecimal
 * @return {string}
 */
export const getRandomColor = () => {
  if (localStorage.getItem(atdColorKeyName) === null) {
    const randomInt = Math.floor(Math.random() * Math.floor(3));
    const colorList = [
      colors.green[900],
      colors.indigo[600],
      colors.orange[600],
      colors.red[600],
    ];
    localStorage.setItem(atdColorKeyName, colorList[randomInt]);
  }
  return localStorage.getItem(atdColorKeyName);
};

// We also create a simple custom hook to read these values from. We want our React components
// to know as little as possible on how everything is handled, so we are not only abstracting them from
// the fact that we are using React's context, but we also skip some imports.
export const useUser = () => {
  const context = useContext(UserContext);

  if (context && context.user) {
    context.user.userColor = getRandomColor();
  }

  if (context === undefined) {
    throw new Error(
      "`useUser` hook must be used within a `UserProvider` component"
    );
  }
  return context;
};

export const getJwt = (user) => user.idToken.jwtToken;

export const getHasuraClaims = (user) => {
  try {
    return JSON.parse(user.idToken.payload["https://hasura.io/jwt/claims"]);
  } catch {
    return null;
  }
};

export const getDatabaseId = (user) => {
  // if (config.env.APP_ENVIRONMENT === "local") return "1";
  try {
    const claims = getHasuraClaims(user);
    return claims["x-hasura-user-db-id"];
  } catch (e) {
    return null;
  }
};

export const isUserSSO = (user) =>
  user.idToken.payload["cognito:username"].startsWith("azuread_");

/**
 * Find the highest role in user roles for UI permissions
 * @param {array} roles - Array of user roles
 * @return {string} Highest user role
 */
export const findHighestRole = (roles) => {
  if (roles === null) return null;

  const findRole = (role) => roles.includes(role) && roles;

  switch (roles) {
    case findRole("moped-admin"):
      return "moped-admin";
    case findRole("moped-editor"):
      return "moped-editor";
    case findRole("moped-viewer"):
      return "moped-viewer";
    case findRole(nonLoginUserRole):
      return nonLoginUserRole;
    default:
  }
};

/**
 * Get the role with the highest permissions level from CognitoUser Object
 * @param {object} user - Cognito User object containing roles in the token
 * @return {string} Highest user role
 */
export const getHighestRole = (user) => {
  const claims = user.idToken.payload["https://hasura.io/jwt/claims"];

  const allowedRoles = JSON.parse(claims)["x-hasura-allowed-roles"];

  return findHighestRole(allowedRoles);
};
