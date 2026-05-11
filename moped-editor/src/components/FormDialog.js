import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
 * @param {boolean} showDialogActions - boolean that controls whether the dialog action buttons are shown or not
 * @param {Object} dialogProps - additional props to pass to the MUI Dialog component
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
  showDialogActions = true,
  dialogProps = {},
}) => {
  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      fullWidth
      scroll="body"
      {...dialogProps}
    >
      <DialogTitle
        variant="h4"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <IconButton onClick={handleClose} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {children}
        {showDialogActions && (
          <DialogActions sx={{ p: 0, pt: 2, pb: 1 }}>
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FormDialog;
