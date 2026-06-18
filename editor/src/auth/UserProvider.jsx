import { useCallback, useEffect, useMemo, useState } from "react";
import { Auth, Amplify } from "aws-amplify";
import {
  initializeUserDBObject,
  setSessionDatabaseData,
  deleteSessionDatabaseData,
  UserContext,
} from "src/auth/user";

// Create a "controller" component that will calculate all the data that we need to give to our
// components below via the `UserContext.Provider` component. This is where the Amplify will be
// mapped to a different interface, the one that we are going to expose to the rest of the app.
const UserProvider = ({ children }) => {
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
      // eslint-disable-next-line react-hooks/set-state-in-effect -- setIsLoginLoading here is intentional: it starts loading spinner before an async Cognito session check
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
          } else {
            deleteSessionDatabaseData();
          }
          setIsLoginLoading(false);
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

export default UserProvider;
