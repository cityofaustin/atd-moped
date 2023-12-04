import React, { useRef } from "react";
import ComponentsDrawControl, {
  areDrawToolsActive,
  isInDrawingMode,
} from "src/components/Maps/ComponentsDrawControl";
import { makeDrawnFeature } from "./utils/features";
import { useTrashButtonClickable } from "./utils/map";
import "./utils/map.css";
import mapboxDrawStylesOverrides from "src/styles/mapboxDrawStylesOverrides";

/**
 * Renders project component create draw tools
 * @param {Function} createDispatch - dispatch to call create actions
 * @param {String} linkMode - tracks if we are editing "lines" or "points"
 * @param {Function} setCursor - function to update the cursor type
 * @param {Function} setIsDrawing - function to update if we are drawing or not
 * @returns {JSX.Element}
 */

const CreateComponentDrawTools = ({
  createDispatch,
  linkMode,
  setCursor,
  setIsDrawing,
}) => {
  const drawControlsRef = useRef();
  const setTrashButtonClickable = useTrashButtonClickable();

  const onCreate = ({ features: createdFeaturesArray }) => {
    // Add properties needed to distinguish drawn features from other features
    const drawnFeatures = createdFeaturesArray.map((feature) => {
      makeDrawnFeature(feature, linkMode);
      return feature;
    });

    setIsDrawing(null);

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
    const wasComponentDragged =
      action === "move" || action === "change_coordinates";

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
    setIsDrawing(null);
    // after we have deleted, disable trash button
    setTrashButtonClickable(false);
  };

  const onModeChange = (props) => {
    setIsDrawing(props.mode);

    if (isInDrawingMode(props.mode)) {
      setCursor("crosshair");
    }
  };

  const onSelectionChange = (props) => {
    setTrashButtonClickable(!!props.features.length > 0);
  };

  return (
    <ComponentsDrawControl
      ref={drawControlsRef}
      onCreate={onCreate}
      onDelete={onDelete}
      onUpdate={onUpdate}
      linkMode={linkMode}
      onModeChange={onModeChange}
      styleOverrides={mapboxDrawStylesOverrides}
      onSelectionChange={onSelectionChange}
    />
  );
};

export default CreateComponentDrawTools;
