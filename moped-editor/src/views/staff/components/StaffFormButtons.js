import React from "react";

import { Button } from "@mui/material";

// Shared sx style functions
const formButtonSx = (theme) => ({
  margin: theme.spacing(1),
  color: "white",
});


export const StaffFormSaveButton = ({ disabled }) => {
  return (
    <Button
      sx={formButtonSx}
      disabled={disabled}
      type="submit"
      color="primary"
      variant="contained"
    >
      Save
    </Button>
  );
};

export const StaffFormResetButton = ({ onClick }) => {
  return (
    <Button sx={formButtonSx} color="secondary" variant="contained" onClick={onClick}>
      Reset
    </Button>
  );
};
