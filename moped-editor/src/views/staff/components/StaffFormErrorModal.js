import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

/**
 * Generates a modal to display form errors
 * @param {Object} apiErrors - Error object
 * @param {string} clearApiErrors - Function to clear errors returned from the API
 * @returns {JSX.Element}
 * @constructor
 */
const StaffFormErrorModal = ({ apiErrors, clearApiErrors }) => (
  <Dialog
    open={!!apiErrors}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {"Error While Creating User"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {(apiErrors?.error?.other ?? []).join(", ")}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={clearApiErrors} color="primary" autoFocus>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default StaffFormErrorModal;
