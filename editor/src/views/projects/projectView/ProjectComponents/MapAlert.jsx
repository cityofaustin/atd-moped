import React from "react";
import { Alert } from "@mui/material";

const MapAlert = ({ message, severity, isOpen, onClose, ...alertProps }) => {
  return (
    isOpen && (
      <Alert severity={severity} onClose={onClose} {...alertProps}>
        {message}
      </Alert>
    )
  );
};

export default MapAlert;
