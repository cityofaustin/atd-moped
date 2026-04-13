import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

/**
 * Dialog component to confirm delete actions across the app
 * @param {string} type - The type of entity being deleted (e.g., "project", "file", "funding record") used to populate the default confirmation text
 * @param {function} submitDelete - The function that calls the appropriate delete mutation and any updates after deletion
 * @param {boolean} isDeleteConfirmationOpen - Boolean state for whether the confirmation dialog is open or not
 * @param {function} setIsDeleteConfirmationOpen - State setter function for controlling whether the confirmation dialog is open or not
 * @param {JSX.Element} children - The React component that triggers the confirmation dialog
 * @param {string} confirmationText - Optional custom confirmation text to display in the dialog in place of the default
 * @param {string} additionalConfirmationText - Optional additional text to append to the default confirmation message
 * @param {string} actionButtonText - Optional custom text for the delete action button, defaults to "Delete"
 * @param {JSX.Element} actionButtonIcon - Optional custom icon for the delete action button, defaults to a delete icon
 * @returns {JSX.Element}
 */
const DeleteConfirmationModal = ({
  type,
  submitDelete,
  isDeleteConfirmationOpen,
  setIsDeleteConfirmationOpen,
  children,
  confirmationText,
  additionalConfirmationText,
  actionButtonText = "Delete",
  actionButtonIcon,
}) => {
  const handleDeleteClose = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const defaultConfirmationText = `Are you sure you want to ${actionButtonText.toLowerCase()} this ${type}?${additionalConfirmationText ? ` ${additionalConfirmationText}` : ""}`;
  const ActionIcon = actionButtonIcon || <DeleteIcon />;

  return (
    <span>
      {children}
      <Dialog
        open={isDeleteConfirmationOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmationText || defaultConfirmationText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleDeleteClose} autoFocus>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={ActionIcon}
            onClick={() => {
              submitDelete();
              // closing the confirmation modal should happen after the delete mutation completes
            }}
          >
            <span>{actionButtonText}</span>
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

export default DeleteConfirmationModal;
