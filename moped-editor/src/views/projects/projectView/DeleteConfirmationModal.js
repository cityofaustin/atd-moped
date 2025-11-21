import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

const DeleteConfirmationModal = ({
  type,
  submitDelete,
  isDeleteConfirmationOpen,
  setIsDeleteConfirmationOpen,
  children,
  confirmationText,
  actionButtonText = "Delete",
  actionButtonIcon,
}) => {
  const handleDeleteClose = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const defaultConfirmationText = `Are you sure you want to delete this ${type}?`;
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
