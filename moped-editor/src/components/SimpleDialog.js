import React from "react";
import { Dialog } from "@material-ui/core";

const SimpleDialog = ({ content: { link, body } }) => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = event => {
    event.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <span>
      <span onClick={handleOpen}>{link}</span>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        {body}
      </Dialog>
    </span>
  );
};

export default SimpleDialog;
