import { createContext, useContext } from "react";
import type { MopedUser } from "src/auth/mopedUser";

export type AuthState =
  | { status: "initializing" }
  | { status: "unauthenticated" }
  | { status: "authenticated"; role: string; mopedUser: MopedUser };

export type AuthContextValue = AuthState & {
  loginWithPassword: (
    usernameOrEmail: string,
    password: string
  ) => Promise<unknown>;
  loginSSO: () => Promise<void>;
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
