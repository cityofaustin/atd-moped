import React from "react";
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";

/**
 * A project summary snackbar
 * @param {Object} snackbarState - The message you would like to see
 * @param {function} snackbarHandle - The function to update state
 * @param {Number} timeOut - Time out in milliseconds (default: 5000 milliseconds--for five seconds)
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummarySnackbar = ({
  snackbarState,
  snackbarHandle,
  timeOut = 7000,
}) => {
  // Careful not to update your own state, break cycle here...
  if (snackbarState?.open === false) return null;
  // Close event
  const handleSnackbarClose = () => snackbarHandle(false, "", "");
  // Timeout closure
  setTimeout(() => handleSnackbarClose(), timeOut);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={snackbarState.open}
      onClose={handleSnackbarClose}
      key={"datatable-snackbar"}
    >
      <Alert onClose={handleSnackbarClose} severity={snackbarState.severity}>
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
};

export default ProjectSummarySnackbar;
