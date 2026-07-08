import React, { useCallback, useState } from "react";
import { AlertProps } from "@mui/material";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertProps["severity"] | "";
}

/**
 * Custom hook to manage snackbar state
 * @returns An object containing snackbarState, handleSnackbar, and handleSnackbarClose
 */
export const useFeedbackSnackbar = () => {
  /**
   * State for the snackbar
   * @property open - Whether the snackbar is open
   * @property message - The message to display in the snackbar
   * @property severity - The MUI Alert severity of the snackbar ("success", "error", "warning", "info")
   */
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "",
  });

  /**
   * Wrapper around snackbar state setter
   * @param open - The new state of open
   * @param message - The message for the snackbar
   * @param severity - The MUI Alert severity of the snackbar ("success", "error", "warning", "info")
   * @param error - The error to be displayed and logged
   */
  const handleSnackbar = useCallback(
    (
      open: boolean,
      message: string,
      severity: AlertProps["severity"] | "",
      error?: unknown
    ) => {
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
  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarState({ open: false, message: "", severity: "" });
  };

  return { snackbarState, handleSnackbar, handleSnackbarClose };
};
