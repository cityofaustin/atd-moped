import React from "react";

import { Button, makeStyles } from "@material-ui/core";

export const useButtonStyles = makeStyles((theme) => ({
  formButton: {
    margin: theme.spacing(1),
    color: "white",
  },
  formButtonGreen: {
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  },
}));

export const StaffFormSaveButton = ({ disabled }) => {
  const classes = useButtonStyles();

  return (
    <Button
      className={classes.formButton}
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
  const classes = useButtonStyles();

  return (
    <Button
      className={classes.formButton}
      color="secondary"
      variant="contained"
      onClick={onClick}
    >
      Reset
    </Button>
  );
};
