import { type ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  type DialogProps,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";

/** Dialog wrapper component for displaying forms with optional save and cancel action buttons
 * This supports our RHF forms with their own buttons and forms that manage their own state. */
interface FormDialogProps {
  /** title of the dialog */
  title: string;
  /** label for the save button */
  saveButtonLabel?: string;
  /** boolean that controls whether the save button is disabled or not */
  saveDisabled: boolean;
  /**  handles closing the dialog */
  handleClose: () => void;
  /** handles saving the form */
  handleSave?: () => void;
  /**  handles canceling the form */
  handleCancel: () => void;
  /** MUI Dialog boolean that controls whether the dialog is open or not */
  open: DialogProps["open"];
  /**  React children elements */
  children: ReactNode;
  /** boolean that controls whether the dialog action buttons are shown or not */
  showDialogActions: boolean;
  /** additional props to pass to the MUI Dialog component */
  dialogProps?: Partial<DialogProps>;
}

const FormDialog = ({
  title,
  saveButtonLabel = "Save",
  saveDisabled,
  handleClose,
  handleSave,
  open,
  children,
  showDialogActions = false,
  dialogProps = {},
}: FormDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="body"
      fullWidth
      maxWidth="sm"
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
      <DialogContent>{children}</DialogContent>
      {showDialogActions && (
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={saveDisabled}
          >
            {saveButtonLabel}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FormDialog;
