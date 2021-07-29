import React from "react";
import ReactDOM from "react-dom";
import MapDrawToolbarButton from "./MapDrawToolbarButton";

import { MODES } from "../../../utils/mapDrawHelpers";
import { ToggleButtonGroup } from "@material-ui/lab";

/**
 * Generates a draw toolbar for the map
 * @param {Object} selectedModeId - The current object representation of the selected tool
 * @param {function} onSwitchMode - Handler that is run whenever we switch tools
 * @param {function} onDelete - Handler that is run whenever we delete an item
 * @return {JSX.Element}
 * @constructor
 */
const DrawToolbar = ({
  selectedModeId,
  onSwitchMode,
  onDelete,
  containerRef = null,
}) => {
  /**
   * Calls onDelete function to delete a point feature from the draw UI
   * @param {Object} e - Event object for click
   */
  const onDeleteClick = e => {
    onDelete(e);
  };

  return containerRef && containerRef.current
    ? ReactDOM.createPortal(
        <ToggleButtonGroup value={selectedModeId} exclusive>
          {MODES.map(mode => {
            return (
              <MapDrawToolbarButton
                selectedModeId={selectedModeId}
                onClick={mode.id === "delete" ? onDeleteClick : onSwitchMode}
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
