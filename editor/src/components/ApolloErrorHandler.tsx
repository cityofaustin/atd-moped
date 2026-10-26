import React from "react";
import FallbackComponent from "src/components/FallbackComponent";

/**
 * ApolloErrorHandler renders a FallbackComponent when an unexpected Apollo error occurs.
 * @param {Object} error - Apollo error returned by useQuery hook
 * @param {React.ReactNode} children - Children components to render when no error occurs
 * @returns {JSX.Element} - A loading backdrop or the children components or an error fallback component
 * @constructor
 */
const ApolloErrorHandler = ({ error, children }) => {
  return <>{error ? <FallbackComponent error={error ?? null} /> : children}</>;
};

export default ApolloErrorHandler;
