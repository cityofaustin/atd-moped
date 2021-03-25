import React from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

import ErrorGraphQL from "../views/errors/ErrorGraphQL";

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
const ApolloLinkErrorHandler = props => {
  const classes = useStyles();

  const { errors, clearErrors, children } = props;

  const errorCode = errors?.code ?? null;

  let outputComponent = null;

  switch (errorCode) {
    case "invalid-jwt":
      window.location = "/moped";
      outputComponent = (
        <Backdrop className={classes.backdrop} open={true} onClick={null}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );

      break;
    default:
      outputComponent = (
        <ErrorGraphQL errors={errors} clearErrors={clearErrors} />
      );
  }

  return <>{!!errors ? outputComponent : children}</>;
};

export default ApolloLinkErrorHandler;
