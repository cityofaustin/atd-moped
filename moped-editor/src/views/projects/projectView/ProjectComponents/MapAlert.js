import React from "react";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    // ComponentMapToolbar is 64 px tall and the alert is 48 px tall
    // Set alert 8px from top to center vertically
    top: "8px",
  },
}));

const MapAlert = ({ message, severity, isOpen, alertProps }) => {
  const classes = useStyles();

  return (
    <Alert severity={severity} {...alertProps}>
      {message}
    </Alert>
  );
};

export default MapAlert;
