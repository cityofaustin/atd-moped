import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const ConfirmDialog = ({
  dialogOpen,
  handleClose,
  handleConfirm,
  confirmText = "Confirm",
  dialogText = "Are you sure?",
}) => {
  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={dialogOpen}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography>{dialogText}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>{confirmText}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmDialog;
