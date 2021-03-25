import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const ErrorGraphQL = props => {
  const classes = useStyles();
  const { errors, clearErrors, children } = props;

  const [open] = useState(!!errors);

  const handleClose = () => {
    clearErrors();
  };

  const handleBack = () => {
    handleClose();
    window.history.back();
  };

  if (open) {
    if (errors.code === "invalid-jwt") {
      window.location = "/moped";
      return (
        <Backdrop className={classes.backdrop} open={true} onClick={null}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    }
  }

  return (
    <>
      {children}
      <Dialog
        onClose={handleClose}
        aria-labelledby="error-dialog-title"
        open={open}
      >
        <DialogTitle id="error-dialog-title" onClose={handleClose}>
          <h3>GraphQL Error</h3>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            There appears to be a problem with the database request.
          </Typography>
          <Typography gutterBottom>
            <strong>Error Type</strong>: {errors.code}
          </Typography>
          <Typography gutterBottom>
            <strong>Message</strong>: {errors.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Retry
          </Button>
          <Button onClick={handleBack} color="primary">
            Back
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ErrorGraphQL;
