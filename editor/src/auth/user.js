import { createContext, useContext } from "react";

// Create a context that will hold the values that we are going to expose to our components.
// Don't worry about the `null` value. It's gonna be *instantly* overridden by the component below
export const UserContext = createContext(null);

// We also create a simple custom hook to read these values from. We want our React components
// to know as little as possible on how everything is handled, so we are not only abstracting them from
// the fact that we are using React's context, but we also skip some imports.
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "`useUser` hook must be used within a `UserProvider` component"
    );
  }
  return context;
};
