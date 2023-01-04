import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

// 8 px from the top

const MapAlertSnackbar = ({ message, severity, isOpen }) => (
  <Snackbar
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
    open={isOpen}
    key={"map-alert-snackbar"}
  >
    <Alert severity={severity}>{message}</Alert>
  </Snackbar>
);

export default MapAlertSnackbar;
