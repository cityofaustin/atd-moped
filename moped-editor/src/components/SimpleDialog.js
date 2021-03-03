import React from 'react';
import Dialog from '@material-ui/core/Dialog';

const SimpleDialog = ({open, handleClose, body }) => {
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        {body}
      </Dialog>
    </div>
  );
}

export default SimpleDialog;