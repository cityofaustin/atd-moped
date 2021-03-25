import React, { useState } from "react";
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";

const ErrorGraphQL = props => {
  const { errors, clearErrors, children } = props;

  const [open] = useState(!!errors);

  const handleClose = () => {
    clearErrors();
  };

  const handleBack = () => {
    handleClose();
    window.history.back();
  };

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
