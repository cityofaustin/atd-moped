import React from "react";
import {
  Typography,
  Popper,
} from "@material-ui/core";


const DashboardEditModal = ({displayText}) => {

  console.log(displayText)
  return (
    <Typography>{displayText}</Typography>
  );
}

export default DashboardEditModal;
