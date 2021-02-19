import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  backdropMessage: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    marginLeft: "1rem",
  },
}));

const ApolloErrorHandler = props => {
  const classes = useStyles();

  // Error Variables
  const error = props?.error ?? null;
  const errorString = JSON.stringify(error);
  const jwtError = errorString.includes("JWT") || errorString.includes("token");

  if (jwtError) {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  return (
    <>
      {jwtError ? (
        <Backdrop className={classes.backdrop} open={true} onClick={null}>
          <CircularProgress color="inherit" />
          <p className={classes.backdropMessage}>Please Wait</p>
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
