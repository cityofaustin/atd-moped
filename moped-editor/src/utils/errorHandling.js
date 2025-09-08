import { createContext, useContext } from "react";

/**
 * Throws error to be displayed in the fallback component rendered through the ApolloErrorHandler component
 * @param {string} message - the error message to be displayed in the FallbackComponent
 * throws {Error} Error object intercepted by FallbackComponent
 */
export const throwFallbackComponentError = (message) => {
  throw Error(message);
};

/**
 * Context for sharing Apollo GraphQL client error state throughout the application.
 */
const ApolloErrorContext = createContext();

/**
 * Custom hook to access Apollo error state from anywhere in the component tree.
 * Must be used within an ApolloErrorProvider (set up in App.js).
 * @returns {JSX.Element} - The context provider wrapping the children
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
