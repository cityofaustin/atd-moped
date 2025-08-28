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

import { ACCOUNT_USER_PROFILE_GET_PLAIN } from "src/queries/account";

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
export const atdSessionDatabaseDataKeyName = "atd_moped_user_db_data";

/**
 * Removes the current user profile color
 */
export const destroyProfileColor = () =>
  localStorage.removeItem(atdColorKeyName);

/**
 * Parses the user Postgres database row from localStorage
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

/** Get the Cognito ID JWT from a Cognito session.
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
 * Persists the user Postgres database row into localStorage
 * @param userObject
 */
export const setSessionDatabaseData = (userObject) =>
  localStorage.setItem(
    atdSessionDatabaseDataKeyName,
    JSON.stringify(userObject)
  );

/**
 * Deletes the user Postgres database row from localStorage
 */
export const deleteSessionDatabaseData = () =>
  localStorage.removeItem(atdSessionDatabaseDataKeyName);

/**
 * Retrieves the user Postgres database row from Hasura
 * @param {Object} session - The Cognito user session.
 * @return {Object} The user database row
 */
export const initializeUserDBObject = async (session) => {
  const token = getCognitoIdJwt(session);
  // Retrieve the data from local storage (if any)
  const sessionDataFromLocalStorage = getSessionDatabaseData();

  // If the session is valid and there is no existing data...
  if (!sessionDataFromLocalStorage) {
    // Fetch the data from Hasura
    try {
      const res = await fetch(config.env.APP_HASURA_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Hasura-Role": `${getHighestRole(session)}`,
        },
        body: JSON.stringify({
          query: ACCOUNT_USER_PROFILE_GET_PLAIN,
          variables: {
            userId: getDatabaseId(session),
          },
        }),
      });

      const resData = await res.json();

      if (resData?.errors) {
        // Show error feedback in sign in form
        throw new Error("Error fetching user data");
      }

      if (resData?.data?.moped_users) {
        const userData = resData.data.moped_users[0];
        return userData;
      }

      throw new Error("No user data found");
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      throw error;
    }
  } else {
    return sessionDataFromLocalStorage;
  }
};

// Create a "controller" component that will calculate all the data that we need to give to our
// components below via the `UserContext.Provider` component. This is where the Amplify will be
// mapped to a different interface, the one that we are going to expose to the rest of the app.
export const UserProvider = ({ children }) => {
  /* User state is set on sign in and log out and allows us to synchronously access the user details
  without calling async Auth.currentSession() where an up-to-date session is not critical. */
  // TODO: It would be better to use Amplify Auth calls to get the user data but need to refactor user state access
  // in other components using const { user } = useUser().
  const [user, setUser] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Amplify's Logger() class doesn't provide a mechanism to use console.[info|debug|warn, etc.],
  // so we would need to turn this back to DEBUG if we're actively debugging authentication.
  useEffect(() => {
    Amplify.Logger.LOG_LEVEL = "INFO";
  }, []);

  /**
   * Handles user login when using username and password.
   * @param {string} usernameOrEmail - The username or email of the user.
   * @param {string} password - The password of the user.
   */
  const login = useCallback(async (usernameOrEmail, password) => {
    setIsLoginLoading(true);

    try {
      await Auth.signIn(usernameOrEmail, password);

      const session = await Auth.currentSession();
      const userDBData = await initializeUserDBObject(session);
      setSessionDatabaseData(userDBData);
      setUser(session);

      setIsLoginLoading(false);
    } catch (err) {
      if (err?.code === "UserNotFoundException") {
        err.message = "Invalid username or password";
      }

      setUser(null);
      setIsLoginLoading(false);
      throw err;
    }
  }, []);

  /**
   * Sign in the user using Azure AD.
   */
  const loginSSO = useCallback(async () => {
    setIsLoginLoading(true);

    try {
      // Auth.federatedSignIn redirects the user so we set user state and local storage DB data after the redirect
      // in the useEffect below that handles route restoration (initializeUserDBObject and setSessionDatabaseData).
      await Auth.federatedSignIn({ provider: "AzureAD" });
    } catch (error) {
      console.error("Error getting user session on sign in: ", error);
      setUser(null);

      setIsLoginLoading(false);
    }
  }, []);

  /**
   * Logs out the user and clears the profile color and user DB data from localStorage.
   */
  const logout = useCallback(async () => {
    try {
      await Auth.signOut();
      destroyProfileColor();
      deleteSessionDatabaseData();
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  }, []);

  /**
   * Returns a valid Cognito session to provide roles and id token to
   * Apollo Client GraphQL requests and Moped API requests.
   */
  const getCognitoSession = useCallback(async () => {
    try {
      const session = await Auth.currentSession();

      return session;
    } catch (err) {
      // Log out user if a Cognito session cannot be retrieved to force a fresh login.
      // This can happen when a refresh token is expired or invalid for example.
      await logout();
      console.error("Error getting Cognito session: ", err);

      return null;
    }
  }, [logout]);

  /**
   * This effect runs when the component mounts and checks if Cognito has a valid session.
   * If there is no user state, it retrieves the current session and sets it to prevent logout
   * when browser is refreshed. If there is no current session, getCognitoSession will return null.
   * Current route is preserved in MainLayout.js and DashboardLayout.js by React Router.
   */
  useEffect(() => {
    if (user === null) {
      setIsLoginLoading(true);

      getCognitoSession()
        .then(async (session) => {
          // Initialize user data on app reload/session resume before proceeding to navigation.
          // Some queries rely on user database data like user id for followed projects.
          // We must populate userDatabaseData if it's null otherwise the query will fail
          // when users are redirected to their last route after a forced logout
          // (see MainLayout.js and DashboardLayout.js for previous route restoration handling).
          if (session) {
            const userDBData = await initializeUserDBObject(session);
            setSessionDatabaseData(userDBData);

            setUser(session);
            setIsLoginLoading(false);
          } else {
            destroyProfileColor();
            deleteSessionDatabaseData();
          }
        })
        .catch((error) => {
          console.error("Error getting Cognito session on app reload: ", error);
          setIsLoginLoading(false);
        });
    }
  }, [user, getCognitoSession]);

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

/** Retrieves the Hasura claims from the Cognito user session.
 * @param {Object} user - The id token payload containing ID token and claims.
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
 * Retrieves the database ID from the Cognito user session.
 * @param {object} user - The Cognito user session containing ID token and claims.
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
 * Get the role with the highest permissions level from Cognito user session.
 * @param {object} user - Cognito User session containing roles in the token
 * @return {string} Highest user role
 */
export const getHighestRole = (user) => {
  const claims = user.idToken.payload["https://hasura.io/jwt/claims"];

  const allowedRoles = JSON.parse(claims)["x-hasura-allowed-roles"];

  return findHighestRole(allowedRoles);
};
