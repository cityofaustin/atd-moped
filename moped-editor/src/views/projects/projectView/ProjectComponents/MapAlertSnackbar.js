import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    // ComponentMapToolbar is 64 px tall and the alert is 48 px tall
    // Set alert 8px from top to center vertically
    top: "8px",
  },
}));

const MapAlertSnackbar = ({ message, severity, isOpen }) => {
  const classes = useStyles();

  return (
    <Snackbar
      classes={classes}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={isOpen}
      key={"map-alert-snackbar"}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
};

export default MapAlertSnackbar;
