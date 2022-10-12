import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";

const DeleteConfirmationModal = ({
  type,
  submitDelete,
  isDeleteConfirmationOpen,
  setIsDeleteConfirmationOpen,
  children,
}) => {

  const handleDeleteClose = () => {
    setIsDeleteConfirmationOpen(false);
  };

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
            {`Are you sure you want to delete this ${type}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={handleDeleteClose}
            autoFocus
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={() => {
              submitDelete();
              handleDeleteClose();
            }}
          >
            <span>Delete</span>
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

export default DeleteConfirmationModal;
