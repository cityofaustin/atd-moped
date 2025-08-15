import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import makeStyles from "@mui/styles/makeStyles";
import FallbackComponent from "./FallbackComponent";
import { useUser } from "src/auth/user";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

/**
 * ApolloErrorHandler renders a loading backdrop when the token is being refreshed
 * when the token loading state is updated when getToken is called.
 * It also renders a FallbackComponent when an unexpected Apollo error occurs.
 * @param {Object} error - Apollo error returned by useQuery hook
 * @param {React.ReactNode} children - Children components to render when no error occurs
 * @returns {JSX.Element} - A loading backdrop or the children components or an error fallback component
 * @constructor
 */
const ApolloErrorHandler = ({ error, children }) => {
  const classes = useStyles();
  const { isLoginLoading } = useUser();

  return (
    <>
      {isLoginLoading ? (
        <Backdrop className={classes.backdrop} open={true} onClick={null}>
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
