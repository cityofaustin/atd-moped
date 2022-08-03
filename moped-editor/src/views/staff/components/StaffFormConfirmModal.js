import React from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

/**
 * Generates a StaffForm Component
 * @param {Object} editFormData - The form data
 * @param {string} userCognitoId - The User's Cognito UUID (if available)
 * @returns {JSX.Element}
 * @constructor
 */
const StaffFormConfirmModal = ({
  isLoading,
  open,
  onClose,
  title,
  message,
  hideCloseButton,
  actionButtonLabel,
  hideActionButton,
  action,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {!hideCloseButton && (
          <Button onClick={onClose} color="primary" autoFocus>
            No
          </Button>
        )}
        {isLoading ? (
          <CircularProgress />
        ) : (
          !hideActionButton && (
            <Button onClick={action} color="primary">
              {actionButtonLabel || "Yes"}
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  );
};

export default StaffFormConfirmModal;
