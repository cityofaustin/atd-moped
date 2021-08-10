import React from "react";
import { makeStyles } from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";

export const useButtonStyles = makeStyles(theme => ({
  buttonImage: {
    width: "1.5rem",
    height: "1.5rem",
  },
  buttonGroupColor: {
    backgroundColor: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.grey["200"],
    },
  },
  buttonGroupColorSelected: {
    backgroundColor: theme.palette.primary.light,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const MapDrawToolbarButton = ({ onClick, selectedModeId, mode }) => {
  const isSelected = mode.id === selectedModeId;

  const classes = useButtonStyles({ isSelected });

  return (
    <ToggleButton
      onClick={onClick}
      key={mode.id}
      id={mode.id}
      value={mode.id}
      aria-label="left aligned"
      className={
        isSelected ? classes.buttonGroupColorSelected : classes.buttonGroupColor
      }
    >
      <img
        id={mode.id}
        alt={mode.text}
        src={`${process.env.PUBLIC_URL}/static/${mode.icon}`}
        className={classes.buttonImage}
      />
    </ToggleButton>
  );
};

export default MapDrawToolbarButton;
