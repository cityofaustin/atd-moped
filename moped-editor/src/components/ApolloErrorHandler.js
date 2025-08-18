import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FallbackComponent from "src/components/FallbackComponent";
import { useUser } from "src/auth/user";

/**
 * ApolloErrorHandler renders a loading backdrop when the token is being refreshed.
 * It also renders a FallbackComponent when an unexpected Apollo error occurs.
 * @param {Object} error - Apollo error returned by useQuery hook
 * @param {React.ReactNode} children - Children components to render when no error occurs
 * @returns {JSX.Element} - A loading backdrop or the children components or an error fallback component
 * @constructor
 */
const ApolloErrorHandler = ({ error, children }) => {
  const { isLoginLoading } = useUser();

  return (
    <>
      {isLoginLoading ? (
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            color: "#fff",
          }}
          open={true}
          onClick={null}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : error ? (
        <FallbackComponent error={error ?? null} />
      ) : (
        children
      )}
    </>
  );
};

export default ApolloErrorHandler;
