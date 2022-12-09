import React, { useRef } from "react";
import ComponentsDrawControl from "src/components/Maps/ComponentsDrawControl";
import { makeDrawnFeature } from "./utils/features";

/**
 * Renders project component draw tools
 * @param {Function} createDispatch - dispatch to call create actions
 * @param {String} linkMode - tracks if we are editing "lines" or "points"
 * @param {Function} setCursor - function to update the cursor type
 * @param {Function} setIsDrawing - function to update if we are drawing or not
 * @returns {JSX.Element}
 */
const EditComponentDrawTools = ({
  editDispatch,
  linkMode,
  setCursor,
  setIsDrawing,
}) => {
  const drawControlsRef = useRef();
  const shouldShowDrawControls = linkMode === "points" || linkMode === "lines";

  const onCreate = ({ features: createdFeaturesArray }) => {
    console.log("update draftEditComponent with new drawn features");
  };

  const onUpdate = ({ features: updatedFeaturesArray, action }) => {
    console.log("handle dragging of drawn features");
  };

  const onDelete = ({ features: deletedFeaturesArray }) => {
    console.log("soft delete existing features in draftEditComponent");
  };

  const onModeChange = ({ mode }) => {
    if (mode === "draw_point" || mode === "draw_line_string") {
      setCursor("crosshair");
      setIsDrawing(true);
    } else {
      setIsDrawing(false);
    }
  };

  const onSelectionChange = ({ features: selectedFeaturesArray }) => {
    const areFeaturesSelected = selectedFeaturesArray.length > 0;

    if (areFeaturesSelected) {
      setIsDrawing(true);
    } else {
      setIsDrawing(false);
    }
  };

  const initializeExistingDrawFeatures = () => {
    console.log("initializeExistingDrawFeatures");
    // TODO: This may be needed when we implement editing existing components
  };

  return (
    shouldShowDrawControls && (
      <ComponentsDrawControl
        ref={drawControlsRef}
        onCreate={onCreate}
        onDelete={onDelete}
        onUpdate={onUpdate}
        linkMode={linkMode}
        onModeChange={onModeChange}
        onSelectionChange={onSelectionChange}
        initializeExistingDrawFeatures={initializeExistingDrawFeatures}
      />
    )
  );
};

export default EditComponentDrawTools;
