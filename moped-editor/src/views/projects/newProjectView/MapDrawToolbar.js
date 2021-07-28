import React from "react";
import MapDrawToolbarButton from "./MapDrawToolbarButton";
import { makeStyles } from "@material-ui/core";

import { MODES } from "../../../utils/mapDrawHelpers";
import { ToggleButtonGroup } from "@material-ui/lab";

export const useToolbarStyles = makeStyles({
  controlContainer: {
    position: "absolute",
    right: "12rem",
    top: ".5rem",
    cursor: "pointer",
  },
});

/**
 * Generates a draw toolbar for the map
 * @param {Object} selectedModeId - The current object representation of the selected tool
 * @param {function} onSwitchMode - Handler that is run whenever we switch tools
 * @return {JSX.Element}
 * @constructor
 */
const DrawToolbar = ({
  selectedModeId,
  onSwitchMode,
}) => {
  const classes = useToolbarStyles();

  return (
    <ToggleButtonGroup
      value={selectedModeId}
      exclusive
      onChange={null}
      aria-label=""
      className={classes.controlContainer}
    >
      {MODES.map(mode => {
        return (
          <MapDrawToolbarButton
            selectedModeId={selectedModeId}
            onClick={onSwitchMode}
            key={mode.id}
            mode={mode}
          />
        );
      })}
    </ToggleButtonGroup>
  );
};

export default DrawToolbar;
