import React, { useCallback, useState } from "react";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";

export const useSnackbar = () => {
  const [snackbarState, setSnackbarState] = useState(false);

  /**
   * Wrapper around snackbar state setter
   * @param {boolean} open - The new state of open
   * @param {String} message - The message for the snackbar
   * @param {String} severity - The severity color of the snackbar
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

  const handleSnackbarClose = () => handleSnackbar(false, "", "");

  return { snackbarState, handleSnackbar, handleSnackbarClose };
};

/**
 * A project summary snackbar
 * @param {Object} snackbarState - The message you would like to see
 * @param {function} handleSnackbarClose - Callback function on snackbar close
 * @param {Number} timeOut - Time out in milliseconds (default: 5000 milliseconds--for five seconds)
 * @returns {JSX.Element}
 * @constructor
 */
const FeedbackSnackbar = ({
  snackbarState,
  handleSnackbarClose,
  timeOut = 5000,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={snackbarState.open}
      onClose={handleSnackbarClose}
      key={"datatable-snackbar"}
      autoHideDuration={timeOut}
    >
      <Alert onClose={handleSnackbarClose} severity={snackbarState.severity}>
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
};

export default FeedbackSnackbar;
