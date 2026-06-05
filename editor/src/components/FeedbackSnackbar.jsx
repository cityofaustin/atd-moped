import { Alert } from "@mui/material";
import { Snackbar } from "@mui/material";

/**
 * A feedback summary snackbar to show on success or error events
 * @param {Object} snackbarState - snackbar state object: { open, message, severity }
 * @param {function} handleSnackbarClose - Callback function on snackbar close
 * @param {Number} autoHideDuration - Duration in milliseconds (default: 5000 milliseconds--for five seconds)
 * @returns {JSX.Element}
 * @constructor
 */
const FeedbackSnackbar = ({
  snackbarState,
  handleSnackbarClose,
  autoHideDuration = 5000,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={snackbarState.open}
      onClose={handleSnackbarClose}
      key={"datatable-snackbar"}
      autoHideDuration={autoHideDuration}
    >
      <Alert onClose={handleSnackbarClose} severity={snackbarState.severity}>
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
};

export default FeedbackSnackbar;
