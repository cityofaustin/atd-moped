import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

/**
 * ApolloErrorHandler attempts to be a component that deals with the
 * JWT Token Expired error in a sensible way. Initially, it only displays
 * a spinner and forces the browser to refresh, allowing AWS Amplify
 * to refresh the token.
 * @param {Object} props - Props.error is the only prop needed at the moment
 * @return {JSX.Element}
 * @constructor
 */
const ApolloErrorHandler = props => {
  const classes = useStyles();

  // Error Variables
  const error = props?.error ?? null;
  const errorString = JSON.stringify(error);
  const jwtError = errorString.includes("JWT") || errorString.includes("token");

  if (jwtError) {
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  return (
    <>
      {jwtError ? (
        <Backdrop className={classes.backdrop} open={true} onClick={null}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        props.children
      )}
    </>
  );
};

export default ApolloErrorHandler;
