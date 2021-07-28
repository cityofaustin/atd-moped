import React from "react";
import ReactDOM from "react-dom";
import MapDrawToolbarButton from "./MapDrawToolbarButton";

import { MODES } from "../../../utils/mapDrawHelpers";
import { ToggleButtonGroup } from "@material-ui/lab";

/**
 * Generates a draw toolbar for the map
 * @param {Object} selectedModeId - The current object representation of the selected tool
 * @param {function} onSwitchMode - Handler that is run whenever we switch tools
 * @return {JSX.Element}
 * @constructor
 */
const DrawToolbar = ({ selectedModeId, onSwitchMode, containerRef = null }) => {
  return containerRef && containerRef.current
    ? ReactDOM.createPortal(
        <ToggleButtonGroup
          value={selectedModeId}
          exclusive
          onChange={null}
          aria-label=""
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
        </ToggleButtonGroup>,
        containerRef.current
      )
    : null;
};

export default DrawToolbar;
