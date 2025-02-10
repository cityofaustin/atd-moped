import React from "react";
import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";

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
