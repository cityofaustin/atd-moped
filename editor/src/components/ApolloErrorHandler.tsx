import { type ReactNode } from "react";
import FallbackComponent from "src/components/FallbackComponent";

interface ApolloErrorHandlerProps {
  /** Apollo error returned by useQuery hook or set in ApolloErrorContext */
  error?: Error | null;
  /** Children components to render when no error occurs */
  children: ReactNode;
}

/**
 * ApolloErrorHandler renders a FallbackComponent when an unexpected Apollo error occurs.
 */
const ApolloErrorHandler = ({ error, children }: ApolloErrorHandlerProps) => {
  return error ? <FallbackComponent error={error} /> : children;
};

export default ApolloErrorHandler;
