import React, { useState } from "react";
import MapDrawToolbarButton from "./MapDrawToolbarButton";
import { Button, makeStyles } from "@material-ui/core";
import theme from "../../../theme/index";

import { MODES } from "../../../utils/mapDrawHelpers";

export const useToolbarStyles = makeStyles({
  controlContainer: {
    position: "absolute",
    width: 34,
    right: 10,
    top: 56,
    background: theme.palette.background.mapControls,
    boxShadow: "0 0 0 2px rgb(0 0 0 / 10%);",
    borderRadius: 4,
    overflow: "hidden", // Keep the child button elements from poking outside the border radius
    outline: "none",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer",
  },
});

const DrawToolbar = ({ selectedModeId, onSwitchMode, onDelete, onSave }) => {
  const [hoveredId, setHoveredId] = useState(null);

  const classes = useToolbarStyles({ selected: selectedModeId });

  const onHover = e => {
    setHoveredId(e && e.target.id);
  };

  const onDeleteClick = e => {
    onDelete(e);
  };

  return (
    <div className={classes.controlContainer}>
      {MODES.map(mode => {
        return (
          <MapDrawToolbarButton
            selectedModeId={selectedModeId}
            onClick={mode.id === "delete" ? onDeleteClick : onSwitchMode}
            hoveredId={hoveredId}
            onHover={onHover}
            key={mode.id}
            mode={mode}
          />
        );
      })}
      <Button variant="contained" color="primary" onClick={onSave}>
        Save
      </Button>
    </div>
  );
};

export default DrawToolbar;
