import { Alert, Snackbar, type SnackbarProps } from "@mui/material";
import type {
  HandleSnackbarClose,
  SnackbarState,
} from "src/components/useFeedbackSnackbar";

/** A feedback summary snackbar to show on success or error events */
interface FeedbackSnackbarProps {
  /** snackbar state object: { open, message, severity } */
  snackbarState: SnackbarState;
  /** Callback function on snackbar close */
  handleSnackbarClose: HandleSnackbarClose;
  /** Duration in milliseconds (default: 5000) */
  autoHideDuration?: SnackbarProps["autoHideDuration"];
}

const FeedbackSnackbar = ({
  snackbarState,
  handleSnackbarClose,
  autoHideDuration = 5000,
}: FeedbackSnackbarProps) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={snackbarState.open}
      onClose={handleSnackbarClose}
      key={"datatable-snackbar"}
      autoHideDuration={autoHideDuration}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={snackbarState.severity || undefined}
      >
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
};

export default FeedbackSnackbar;
