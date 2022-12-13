import React, { useRef } from "react";
import ComponentsDrawControl from "src/components/Maps/ComponentsDrawControl";
import { makeDrawnFeature, useExistingDrawnFeatures } from "./utils/features";

/**
 * Renders project component edit draw tools
 * @param {Function} editDispatch - dispatch to call edit actions
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
  draftEditComponent,
}) => {
  const drawControlsRef = useRef();
  useExistingDrawnFeatures({
    drawControlsRef,
    draftEditComponent,
    linkMode,
  });

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
    // TODO: Load existing drawn features from draftEditComponent
  };

  return (
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
  );
};

export default EditComponentDrawTools;
