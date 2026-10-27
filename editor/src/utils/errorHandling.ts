import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from "react";

/**
 * Throws error to be displayed in the fallback component rendered through the ApolloErrorHandler component
 * @param message - the error message to be displayed in the FallbackComponent
 * @throws Error object intercepted by FallbackComponent
 */
export const throwFallbackComponentError = (message: string): never => {
  throw Error(message);
};

interface ApolloErrorContextValue {
  /** Latest GraphQL or network error from the Apollo client error link */
  apolloError: Error | null;
  /** Sets or clears (with null) the Apollo error */
  setApolloError: Dispatch<SetStateAction<Error | null>>;
}

/**
 * Context for sharing Apollo GraphQL client error state throughout the application.
 */
const ApolloErrorContext = createContext<ApolloErrorContextValue | null>(null);

/**
 * Custom hook to access Apollo error state from anywhere in the component tree.
 * Must be used within an ApolloErrorContext.Provider (set up in App.jsx).
 */
export const useApolloErrorContext = () => {
  const context = useContext(ApolloErrorContext);
  if (!context) {
    throw new Error(
      "useApolloErrorContext must be used within an ApolloErrorProvider"
    );
  }
  return context;
};

export default ApolloErrorContext;
