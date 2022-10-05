import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";

const DeleteConfirmationModal = () => {
    console.log("you opened a modal");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDeleteCommentOpen = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteCommentClose = () => {
    setDeleteConfirmationOpen(false);
  };

  return (
    <div>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteCommentClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCommentClose}>Disagree</Button>
          <Button onClick={handleDeleteCommentClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteConfirmationModal;
