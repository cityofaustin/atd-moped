import { createContext, useContext } from "react";

/**
 * AuthContext provides authentication-related values and functions to the components wrapped in AuthProvider
 */
export const AuthContext = createContext(null);

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
