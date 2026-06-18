import { useCallback, useState } from "react";

/**
 * Custom hook to manage snackbar state
 * @returns {Object} - snackbarState, handleSnackbar, handleSnackbarClose
 */
export const useFeedbackSnackbar = () => {
  /**
   * State for the snackbar
   * @property {boolean} open - Whether the snackbar is open
   * @property {String} message - The message to display in the snackbar
   * @property {String} severity - The MUI Alert severity of the snackbar ("success", "error", "warning", "info")
   */
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "",
  });

  /**
   * Wrapper around snackbar state setter
   * @param {boolean} open - The new state of open
   * @param {String} message - The message for the snackbar
   * @param {String} severity - The MUI Alert severity of the snackbar ("success", "error", "warning", "info")
   * @param {Object} error - The error to be displayed and logged
   */
  const handleSnackbar = useCallback(
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
  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarState({ open: false, message: "", severity: "" });
  };

  return { snackbarState, handleSnackbar, handleSnackbarClose };
};
