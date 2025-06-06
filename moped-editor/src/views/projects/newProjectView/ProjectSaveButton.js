import React from "react";
import clsx from "clsx";
import makeStyles from "@mui/styles/makeStyles";
import { green } from "@mui/material/colors";
import { Icon, Button, CircularProgress } from "@mui/material";

/**
 * Styles
 */
const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
    marginRight: 0,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[500],
    },
    disabled: true,
    cursor: "default",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

/**
 * ProjectSaveButton - A button that shows an animated status when saving.
 * https://material-ui.com/components/progress/#interactive-integration
 * @param {str} label - The string to show within the button
 * @param {bool} loading - When true, it forces the button show loading spinner status.
 * @param {bool} success - Then true, it forces the button to show green status with checkmark.
 * @param {function} handleButtonClick - The onClick handler
 * @return {JSX.Element}
 * @constructor
 */
export default function ProjectSaveButton({
  label,
  loading,
  success,
  handleButtonClick,
  disabled,
  buttonOptions = {},
}) {
  const classes = useStyles();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  return (
    <div className={classes.wrapper}>
      <Button
        variant="contained"
        color="primary"
        className={buttonClassname}
        disabled={(loading && !success) || disabled}
        onClick={success ? null : handleButtonClick}
        {...buttonOptions}
      >
        {success ? <Icon>check</Icon> : label}
      </Button>
      {loading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
}
