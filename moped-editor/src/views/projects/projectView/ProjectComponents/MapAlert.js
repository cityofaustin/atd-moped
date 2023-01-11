import React from "react";
import { Alert } from "@material-ui/lab";

const MapAlert = ({ message, severity, isOpen, alertProps }) => {
  return (
    isOpen && (
      <Alert severity={severity} {...alertProps}>
        {message}
      </Alert>
    )
  );
};

export default MapAlert;
