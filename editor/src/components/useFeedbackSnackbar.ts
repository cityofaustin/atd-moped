import { useCallback, useState, type SyntheticEvent } from "react";
import type { AlertProps, SnackbarCloseReason } from "@mui/material";

export interface SnackbarState {
  /** Whether the snackbar is open */
  open: boolean;
  /** The message to display in the snackbar */
  message: string;
  /** The MUI Alert severity ("success", "error", "warning", "info") */
  severity: AlertProps["severity"] | "";
}

/**
 * Function to update the snackbar state
 * @param open - Whether the snackbar is open
 * @param message - The message for the snackbar
 * @param severity - The MUI Alert severity ("success", "error", "warning", "info")
 * @param error - The error to be displayed and logged
 */
export type HandleSnackbar = (
  open: boolean,
  message: string,
  severity: AlertProps["severity"] | "",
  error?: unknown
) => void;

/**
 * Shared close handler for Snackbar and Alert.
 * Reason is optional so the same callback works for both components.
 */
export type HandleSnackbarClose = (
  event: Event | SyntheticEvent,
  reason?: SnackbarCloseReason
) => void;

/**
 * Custom hook to manage snackbar state
 * @returns An object containing snackbarState, handleSnackbar, and handleSnackbarClose
 */
export const useFeedbackSnackbar = () => {
  /**
   * State for the snackbar
   */
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "",
  });

  /**
   * Wrapper around snackbar state setter
   */
  const handleSnackbar: HandleSnackbar = useCallback(
    (open, message, severity, error) => {
      // if there is an error, render error message,
      // otherwise, render success message
      if (error) {
        setSnackbarState({
          open: open,
          message: `${message}. Refresh the page to try again.`,
          severity: severity,
        });
        console.error(error);
      } else {
        setSnackbarState({
          open: open,
          message: message,
          severity: severity,
        });
      }
    },
    [setSnackbarState]
  );

  /**
   * Callback to reset the snackbar state on snackbar close
   */
  const handleSnackbarClose: HandleSnackbarClose = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarState({ open: false, message: "", severity: "" });
  };

  return { snackbarState, handleSnackbar, handleSnackbarClose };
};
