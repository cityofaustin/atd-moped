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
 * Generates a modal to display a confirm message
 * @param {boolean} isLoading - loading state
 * @param {boolean} open - modal open state
 * @param {function} onClose - callback that fires on modal close
 * @param {string} title - title shown in modal
 * @param {string} message - message shown in modal
 * @param {boolean} hideCloseButton - should the close button appear or not
 * @param {string} actionButtonLabel - label to apply to the button that fires the action function
 * @param {boolean} hideActionButton - should we hide the action button or not
 * @param {function} action - fires on action button click
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
