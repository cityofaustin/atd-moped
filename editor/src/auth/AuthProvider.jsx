import { useCallback, useEffect, useMemo, useState } from "react";
import { Auth, Hub } from "aws-amplify";
import { AuthContext } from "src/auth/auth";
import { getHighestRole } from "src/auth/claims";
import { getCognitoSession } from "src/auth/session";
import {
  initializeUserDBObject,
  setSessionDatabaseData,
  deleteSessionDatabaseData,
} from "src/auth/mopedUser";

/**
 * Auth provider for the app. The Amplify Hub listener is the source of truth for
 * the user auth state.
 *
 * State is one of:
 *   { status: "initializing" }
 *   { status: "unauthenticated" }
 *   { status: "authenticated", role, mopedUser }
 *
 * Tokens are fetched at the point of use (see src/auth/session.js) and not held
 * in state.
 */
const AuthProvider = ({ children }) => {
  const [state, setState] = useState({ status: "initializing" });

  /**
   * Resolve the current session into auth state
   */
  const resolveSession = useCallback(async () => {
    const session = await getCognitoSession();

    if (!session) {
      deleteSessionDatabaseData();
      setState({ status: "unauthenticated" });
      return;
    }

    const role = getHighestRole(session);

    // A session we can't retrieve a Hasura role from is unusable, so sign out
    // rather than leaving the user on a page where every query will fail.
    if (!role) {
      console.error("No Hasura role found in Cognito session");
      await Auth.signOut();
      return;
    }

    try {
      // TODO: Remove localStorage cache and fetch user data when needed for a view
      // to prevent de-synchronization between the local cache and the database
      // See issue #30400
      const mopedUser = await initializeUserDBObject(session);
      setSessionDatabaseData(mopedUser);

      setState({ status: "authenticated", role, mopedUser });
    } catch (error) {
      console.error("Error fetching Moped user record: ", error);
      await Auth.signOut();
    }
  }, []);

  /**
   * Check for an existing session on mount and subscribe to auth events.
   * Hub is the only other writer of auth state and is the source of truth
   * for auth changes.
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resolveSession is async; the first setState happens after awaiting Amplify
    resolveSession();

    const listener = ({ payload }) => {
      switch (payload.event) {
        case "signIn":
          resolveSession();
          break;
        case "signOut":
          deleteSessionDatabaseData();
          setState({ status: "unauthenticated" });
          break;
        default:
          break;
      }
    };

    Hub.listen("auth", listener);

    return () => Hub.remove("auth", listener);
  }, [resolveSession]);

  /**
   * Sign in with username and password. State is set by the Hub listener.
   * @param {string} usernameOrEmail
   * @param {string} password
   */
  const loginWithPassword = useCallback(async (usernameOrEmail, password) => {
    try {
      await Auth.signIn(usernameOrEmail, password);
    } catch (err) {
      if (err?.code === "UserNotFoundException") {
        err.message = "Invalid username or password";
      }
      throw err;
    }
  }, []);

  /**
   * Sign in with Azure AD. Redirects away from the app. State is set when
   * the browser returns and the useEffect resolves the session.
   */
  const loginSSO = useCallback(
    () => Auth.federatedSignIn({ provider: "AzureAD" }),
    []
  );

  /**
   * Sign out. The Hub "signOut" handler clears state and the cached user row,
   * so explicit logouts and SDK-initiated ones take the same path.
   */
  const logout = useCallback(() => Auth.signOut(), []);

  const values = useMemo(
    () => ({ ...state, loginWithPassword, loginSSO, logout }),
    [state, loginWithPassword, loginSSO, logout]
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
