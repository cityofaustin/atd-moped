import type { ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

interface DeleteConfirmationModalProps {
  /** The type of entity being deleted (e.g., "project", "file", "funding record") used to populate the default confirmation text */
  type: string;
  /** The function that calls the appropriate delete mutation and any updates after deletion */
  submitDelete: () => void;
  /** Boolean state for whether the confirmation dialog is open or not */
  isDeleteConfirmationOpen: boolean;
  /** State setter function for controlling whether the confirmation dialog is open or not */
  setIsDeleteConfirmationOpen: (isOpen: boolean) => void;
  /** The React component that triggers the confirmation dialog (optional) */
  children?: ReactNode;
  /** Custom confirmation text to display in the dialog in place of the default (optional) */
  confirmationText?: string;
  /** Additional text to append to the default confirmation message (optional) */
  additionalConfirmationText?: string;
  /** Custom text for the delete action button, defaults to "Delete" */
  actionButtonText?: string;
  /** Custom icon for the delete action button, defaults to a delete icon */
  actionButtonIcon?: ReactNode;
  /** Mutation loading status from delete mutation */
  mutationPending?: boolean;
}

/**
 * Dialog component to confirm delete actions across the app
 */
const DeleteConfirmationModal = ({
  type,
  submitDelete,
  isDeleteConfirmationOpen,
  setIsDeleteConfirmationOpen,
  children,
  confirmationText,
  additionalConfirmationText,
  actionButtonText = "Delete",
  actionButtonIcon,
  mutationPending,
}: DeleteConfirmationModalProps) => {
  const handleDeleteClose = () => {
    setIsDeleteConfirmationOpen(false);
  };

  const defaultConfirmationText = `Are you sure you want to ${actionButtonText.toLowerCase()} this ${type}?${additionalConfirmationText ? ` ${additionalConfirmationText}` : ""}`;
  const ActionIcon = actionButtonIcon || <DeleteIcon />;

  return (
    <span>
      {children}
      <Dialog
        open={isDeleteConfirmationOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmationText || defaultConfirmationText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleDeleteClose} autoFocus>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            startIcon={ActionIcon}
            disabled={mutationPending}
            onClick={() => {
              submitDelete();
              // closing the confirmation modal should happen after the delete mutation completes
            }}
          >
            <span>{actionButtonText}</span>
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  );
};

export default DeleteConfirmationModal;
