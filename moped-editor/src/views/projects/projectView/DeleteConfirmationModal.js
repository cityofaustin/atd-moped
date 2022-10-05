import React, { useState } from "react";
import {
  Button,
  Chip,
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
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const DeleteConfirmationModal = ({ type, item, submitDelete, children }) => {
  const classes = useStyles();

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const handleDeleteOpen = () => {
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteConfirmationOpen(false);
  };

  return (
    <span>
      {type === "comment" && (
        <span onClick={() => handleDeleteOpen()}>{children}</span>
      )}
      {type === "tag" && (
        <Chip
          label={item.moped_tag.name}
          onDelete={() => handleDeleteOpen()}
          className={classes.chip}
        />
      )}
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
              type === "comment" && submitDelete(item.project_note_id);
              type === "tag" && submitDelete(item);
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
