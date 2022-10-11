import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/DeleteOutlined";

const useStyles = makeStyles((theme) => ({
  deleteButton: {
    color: theme.palette.error.main,
  },
}));

const DeleteConfirmationModal = ({
  type,
  submitDelete,
  deleteConfirmationOpen,
  setDeleteConfirmationOpen,
  children
}) => {
  const classes = useStyles();

  const handleDeleteClose = () => {
    setDeleteConfirmationOpen(false);
  };

  return (
    <span>
      {children}
      <Dialog
        open={deleteConfirmationOpen}
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
            variant="outlined"
            className={classes.deleteButton}
            startIcon={<DeleteIcon />}
            onClick={() => {
              submitDelete();
              handleDeleteClose();
            }}
          >
            <span>Delete</span>
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleDeleteClose}
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
