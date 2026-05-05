import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
} from "@mui/material";

/**
 * Dialog wrapper component for displaying forms
 * @param {string} title - title of the dialog
 * @param {string} saveButtonLabel - label for the save button
 * @param {string} cancelButtonLabel - label for the cancel button
 * @param {boolean} saveDisabled - boolean that controls whether the save button is disabled or not
 * @param {function} handleClose - handles closing the dialog
 * @param {function} handleSave - handles saving the form
 * @param {function} handleCancel - handles canceling the form
 * @param {boolean} dialogOpen - boolean that controls whether the dialog is open or not
 * @param {Object} children - React children elements
 * @returns {JSX.Element}
 */
const FormDialog = ({
  title,
  saveButtonLabel = "Save",
  cancelButtonLabel = "Cancel",
  saveDisabled,
  handleClose,
  handleSave,
  handleCancel,
  dialogOpen,
  children,
}) => {
  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle variant="h4">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {cancelButtonLabel}
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          startIcon={<Icon>save</Icon>}
          disabled={saveDisabled}
        >
          {saveButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
