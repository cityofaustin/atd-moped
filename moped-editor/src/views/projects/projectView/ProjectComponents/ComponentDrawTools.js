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
const ComponentDrawTools = ({
  createDispatch,
  linkMode,
  setCursor,
  setIsDrawing,
}) => {
  const drawControlsRef = useRef();
  const shouldShowDrawControls = linkMode === "points" || linkMode === "lines";

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

    createDispatch({
      type: "add_drawn_features",
      payload: drawnFeatures,
      callback: updateMapDrawToolFeatures,
    });
  };

  const onUpdate = ({ features: updatedFeaturesArray, action }) => {
    const wasComponentDragged = action === "move";

    if (wasComponentDragged) {
      createDispatch({
        type: "update_drawn_features",
        payload: updatedFeaturesArray,
      });
    }
  };

  const onDelete = ({ features: deletedFeaturesArray }) => {
    createDispatch({
      type: "delete_drawn_features",
      payload: deletedFeaturesArray,
    });
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

export default ComponentDrawTools;
