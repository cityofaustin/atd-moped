import React, { useRef } from "react";
import ComponentsDrawControl from "src/components/Maps/ComponentsDrawControl";
import { makeDrawnFeature, useExistingDrawnFeatures } from "./utils/features";
import editDrawStylesOverrides from "src/styles/editDrawStylesOverrides";

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
    // Add properties needed to distinguish drawn features from other features
    const drawnFeatures = createdFeaturesArray.map((feature) => {
      makeDrawnFeature(feature, linkMode);
      return feature;
    });

    // We must override the features in the draw control's internal state with ones
    // that have our properties so that we can find them later in onDelete
    const updateMapDrawToolFeatures = (updatedFeatures) =>
      drawControlsRef.current.set({
        type: "FeatureCollection",
        features: updatedFeatures,
      });

    editDispatch({
      type: "add_drawn_features",
      payload: drawnFeatures,
      callback: updateMapDrawToolFeatures,
    });
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

  return (
    <ComponentsDrawControl
      ref={drawControlsRef}
      onCreate={onCreate}
      onDelete={onDelete}
      onUpdate={onUpdate}
      linkMode={linkMode}
      onModeChange={onModeChange}
      onSelectionChange={onSelectionChange}
      styleOverrides={editDrawStylesOverrides}
    />
  );
};

export default EditComponentDrawTools;
