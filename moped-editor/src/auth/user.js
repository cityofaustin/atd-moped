import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Auth, Amplify } from "aws-amplify";

import { colors } from "@mui/material";

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
  const storedData = localStorage.getItem(atdSessionDatabaseDataKeyName);
  if (storedData === "undefined" || storedData === null) {
    return null;
  }
  try {
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error parsing session database data:", error);
    return null;
  }
};

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
 * Custom hook that memoizes the session database data
 * This prevents unnecessary re-renders when the data hasn't changed
 * @return {Object} The memoized session database data
 */
export const useSessionDatabaseData = () => {
  return useMemo(() => getSessionDatabaseData(), []);
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
export const initializeUserDBObject = async (userObject) => {
  const session = await Auth.currentSession();
  const token = session?.idToken?.getJwtToken();

  // Retrieve the data (if any)
  const sessionData = getSessionDatabaseData();

  // If the user object is valid and there is no existing data...
  if (userObject && sessionData === null) {
    // Fetch the data from Hasura
    fetch(config.env.APP_HASURA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Hasura-Role": `${getHighestRole(userObject)}`,
      },
      body: JSON.stringify({
        query: ACCOUNT_USER_PROFILE_GET_PLAIN,
        variables: {
          userId: getDatabaseId(userObject),
        },
      }),
    }).then((res) => {
      // Then we parse the response
      res.json().then((resData) => {
        if (resData?.errors) {
          console.error(resData.errors);
        }
        if (resData?.data?.moped_users) {
          setSessionDatabaseData(resData.data.moped_users[0]);
        }
      });
    });
  }
};

/**
 * Retrieves persisted user context object from localstorage so users remain logged in
 * between app loads and so the refresh token can be used to get a valid Cognito session
 * when needed.
 * @param {string} atdSessionKeyName - The key name for the user context in localStorage
 * @return {object}
 */
const getPersistedContext = () => {
  return JSON.parse(localStorage.getItem(atdSessionKeyName)) || null;
};

/**
 * Persists user context object in local storage after successful login.
 * @param {str} context - The user context object
 */
const setPersistedContext = (context) => {
  localStorage.setItem(atdSessionKeyName, JSON.stringify(context));
};

// Create a "controller" component that will calculate all the data that we need to give to our
// components below via the `UserContext.Provider` component. This is where the Amplify will be
// mapped to a different interface, the one that we are going to expose to the rest of the app.
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(getPersistedContext());
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Amplify's Logger() class doesn't provide a mechanism to use console.[info|debug|warn, etc.],
  // so we would need to turn this back to DEBUG if we're actively debugging authentication.
  useEffect(() => {
    Amplify.Logger.LOG_LEVEL = "INFO";
  }, []);

  useEffect(() => {
    if (!user) {
      // If there is no user, we remove the persisted context
      destroyLoggedInProfile();
    } else {
      initializeUserDBObject(user);
    }
  }, [user]);

  /**
   * Handles user login when using username and password.
   * We make sure to handle the user update here, but return the resolve value in order for our components to be
   * able to chain additional `.then()` logic. Additionally, we `.catch` the error and "enhance it" by providing
   * a message that our React components can use.
   * @param {string} usernameOrEmail - The username or email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<void>}
   */
  const login = useCallback(async (usernameOrEmail, password) => {
    setIsLoginLoading(true);

    return Auth.signIn(usernameOrEmail, password)
      .then((user) => {
        setUser(user.signInUserSession);
        setPersistedContext(user.signInUserSession);

        setIsLoginLoading(false);

        return user.signInUserSession;
      })
      .catch((err) => {
        if (err.code === "UserNotFoundException") {
          err.message = "Invalid username or password";
        }

        setPersistedContext(null);
        setUser(null);

        // ... (other checks)
        setIsLoginLoading(false);
        throw err;
      });
  }, []);

  /**
   * Sign in the user using Azure AD.
   *
   * @returns {Promise<void>}
   */
  const loginSSO = useCallback(async () => {
    setIsLoginLoading(true);

    try {
      await Auth.federatedSignIn({ provider: "AzureAD" });
      setIsLoginLoading(false);
    } catch (error) {
      console.error("Error getting user session on sign in: ", error);
      setIsLoginLoading(false);
    }
  }, []);

  /**
   * Logs out the user and clears the user context.
   * This function also destroys the profile color and logged-in profile from localStorage.
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    destroyProfileColor();
    destroyLoggedInProfile();
    deleteSessionDatabaseData();

    try {
      await Auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  }, []);

  /**
   * Returns a valid Cognito session to provide valid roles and id JWT to
   * Apollo Client GraphQL requests and Moped API requests.
   *
   * @returns {Promise<CognitoUserSession|null>} A valid Cognito session or null
   */
  const getCognitoSession = useCallback(async () => {
    try {
      const session = await Auth.currentSession();
      setIsLoginLoading(false);

      console.log("User session refreshed:", session);
      console.log(
        "Token expires:",
        epochToCentralTime(session?.idToken?.payload.exp)
      );
      // Update the user context with the new session for next app reload
      setPersistedContext(session);

      return session;
    } catch (err) {
      console.error("Error getting Cognito session: ", err);
      setIsLoginLoading(false);

      return null;
    }
  }, []);

  // Make sure to not force a re-render on the components that are reading these values,
  // unless the `user` value has changed. This is an optimization that is mostly needed in cases
  // where the parent of the current component re-renders and thus the current component is forced
  // to re-render as well. If it does, we want to make sure to give the `UserContext.Provider` the
  // same value as long as the user data is the same. If you have multiple other "controller"
  // components or Providers above this component, then this will be a performance booster.
  const values = useMemo(
    () => ({
      user,
      login,
      loginSSO,
      logout,
      isLoginLoading,
      getCognitoSession,
    }),
    [user, isLoginLoading, getCognitoSession, login, loginSSO, logout]
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

  if (context && context.user && !context.user.userColor) {
    context.user.userColor = getRandomColor();
  }

  if (context === undefined) {
    throw new Error(
      "`useUser` hook must be used within a `UserProvider` component"
    );
  }
  return context;
};

/** Retrieves the Hasura claims from the user object.
 * @param {Object} user - The id token payload object containing ID token and claims.
 * @returns {Object|null} The Hasura claims or null if not found.
 */
export const getHasuraClaims = (user) => {
  try {
    return JSON.parse(user.idToken.payload["https://hasura.io/jwt/claims"]);
  } catch {
    return null;
  }
};

/**
 * Retrieves the database ID from the user object.
 * @param {*} user - The user object containing ID token and claims.
 * @returns {string|null} The database ID or null if not found.
 */
export const getDatabaseId = (user) => {
  try {
    const claims = getHasuraClaims(user);
    return claims["x-hasura-user-db-id"];
  } catch (e) {
    console.error("getDatabaseId error ", e);
    return null;
  }
};

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
