import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Hub } from "aws-amplify/utils";
import { signIn, signInWithRedirect, signOut } from "aws-amplify/auth";
import { AuthContext, type AuthState } from "src/auth/auth";
import { getHighestRole } from "src/auth/claims";
import { getCognitoSession } from "src/auth/session";
import { fetchMopedUser } from "src/auth/mopedUser";

/**
 * Auth provider for the app. The Amplify Hub listener is the source of truth for
 * the user auth state.
 *
 * State is one of:
 *   { status: "initializing" }
 *   { status: "unauthenticated" }
 *   { status: "authenticated", role, mopedUser }
 *
 * Tokens are fetched at the point of use (see src/auth/session.ts) and not held
 * in state.
 */
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ status: "initializing" });

  /**
   * Resolve the current session into auth state
   */
  const resolveSession = useCallback(async () => {
    const session = await getCognitoSession();

    if (!session) {
      setState({ status: "unauthenticated" });
      return;
    }

    const role = getHighestRole(session);

    // A session we can't retrieve a Hasura role from is unusable, so sign out
    // rather than leaving the user on a page where every query will fail.
    if (!role) {
      console.error("No Hasura role found in Cognito session");
      await signOut();
      return;
    }

    try {
      const mopedUser = await fetchMopedUser(session);

      setState({ status: "authenticated", role, mopedUser });
    } catch (error) {
      console.error("Error fetching Moped user record: ", error);
      await signOut();
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

    const hubListenerCancel = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          resolveSession();
          break;
        case "signedOut":
          setState({ status: "unauthenticated" });
          break;
        // If token refresh fails, treat the user as unauthenticated.
        case "tokenRefresh_failure":
          setState({ status: "unauthenticated" });
          break;
        default:
          break;
      }
    });

    return () => hubListenerCancel();
  }, [resolveSession]);

  /**
   * Sign in with username and password. State is set by the Hub listener.
   */
  const loginWithPassword = useCallback(
    (usernameOrEmail: string, password: string) =>
      signIn({ username: usernameOrEmail, password }),
    []
  );

  /**
   * Sign in with Azure AD. Redirects away from the app. State is set when
   * the browser returns and the useEffect resolves the session.
   */
  const loginSSO = useCallback(
    () => signInWithRedirect({ provider: { custom: "AzureAD" } }),
    []
  );

  /**
   * Sign out. The Hub "signedOut" handler clears state,
   * so explicit logouts and SDK-initiated ones take the same path.
   */
  const logout = useCallback(() => signOut(), []);

  const values = useMemo(
    () => ({ ...state, loginWithPassword, loginSSO, logout }),
    [state, loginWithPassword, loginSSO, logout]
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
