import React from "react";

import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formButton: {
    margin: theme.spacing(1),
    color: "white",
  },
}));

export const StaffFormSaveButton = ({ disabled }) => {
  const classes = useStyles();

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
  const classes = useStyles();

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
