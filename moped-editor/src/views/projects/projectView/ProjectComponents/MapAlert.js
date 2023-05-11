import React from "react";
import { Alert } from '@mui/material';

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
