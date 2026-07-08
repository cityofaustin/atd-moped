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
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "",
  });

  /**
   * Wrapper around snackbar state setter
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
