import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  deleteCommentButton: {
    color: theme.palette.error.main,
  },
}));

const DeleteConfirmationModal = ({ item, submitDeleteComment, children }) => {
  const classes = useStyles();

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDeleteCommentOpen = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteCommentClose = () => {
    setDeleteConfirmationOpen(false);
  };

  return (
    <span>
      <span onClick={() => handleDeleteCommentOpen()}>{children}</span>
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleDeleteCommentClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this comment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            className={classes.deleteCommentButton}
            onClick={() => {
              submitDeleteComment(item.project_note_id);
              handleDeleteCommentClose();
            }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleDeleteCommentClose}
            autoFocus
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

export default DeleteConfirmationModal;
