import { createContext, useContext } from "react";
import type { MopedUser } from "src/auth/mopedUser";
import type { MopedRole } from "src/auth/claims";

export type AuthState =
  /* When signing in, no role or mopedUser is available yet */
  | { status: "initializing" }
  /* When not signed in, no role or mopedUser is ever available */
  | { status: "unauthenticated" }
  /* When signed in, a role and mopedUser are available */
  | { status: "authenticated"; role: MopedRole; mopedUser: MopedUser };

export type AuthContextValue = AuthState & {
  /* Logs in the user with a username/email and password */
  loginWithPassword: (
    usernameOrEmail: string,
    password: string
  ) => Promise<unknown>;
  /* Logs in the user using SSO via Microsoft */
  loginSSO: () => Promise<void>;
  /* Logs out the currently authenticated user */
  logout: () => Promise<void>;
};

/**
 * AuthContext provides authentication-related values and functions to the components wrapped in AuthProvider
 */
export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Custom hook to consume the AuthContext from inside a component wrapped in AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "`useAuth` hook must be used within a `AuthProvider` component"
    );
  }
  return context;
};

/** Returns the moped_users row. Only valid when status is "authenticated".
 */
export const useMopedUser = (): MopedUser | null => {
  const auth = useAuth();
  return auth.status === "authenticated" ? auth.mopedUser : null;
};
