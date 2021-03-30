import React, { useState } from "react";
import MapDrawToolbarButton from "./MapDrawToolbarButton";
import { makeStyles } from "@material-ui/core";

import { MODES } from "../../../utils/mapDrawHelpers";

export const useToolbarStyles = makeStyles({
  controlContainer: {
    position: "absolute",
    width: 34,
    right: 10,
    top: 56,
    background: "#fff",
    boxShadow: "0 0 0 2px rgb(0 0 0 / 10%);",
    borderRadius: 4,
    outline: "none",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer",
  },
  controlDelete: ({ selected }) => ({
    height: 34,
    padding: 7,
    display: "flex",
    justifyContent: "left",
    background: selected ? "#0071bc" : "inherit",
    "&:hover": {
      background: selected ? "#0071bc" : "#e6e6e6",
    },
  }),
});

const DrawToolbar = ({ selectedModeId, onSwitchMode, onDelete }) => {
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
    </div>
  );
};

export default DrawToolbar;
