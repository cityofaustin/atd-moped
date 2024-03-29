import React, { useRef } from "react";
import ComponentsDrawControl, {
  isInDrawingMode,
} from "src/components/Maps/ComponentsDrawControl";
import { makeDrawnFeature, useExistingDrawnFeatures } from "./utils/features";
import { useTrashButtonClickable } from "./utils/map";
import mapboxDrawStylesOverrides from "src/styles/mapboxDrawStylesOverrides";

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

  const setTrashButtonClickable = useTrashButtonClickable();

  // We must override the features in the draw control's internal state with ones
  // that have our properties so that we can find them later in onDelete
  const updateMapDrawToolFeatures = (updatedFeatures) => {
    const drawToolsFeatures = updatedFeatures.map((feature) => {
      const { id, properties, type, geometry } = feature;

      return { id, properties, type, geometry };
    });

    drawControlsRef.current.set({
      type: "FeatureCollection",
      features: drawToolsFeatures,
    });
  };

  const onCreate = ({ features: createdFeaturesArray }) => {
    // Add properties needed to distinguish drawn features from other features
    const drawnFeatures = createdFeaturesArray.map((feature) => {
      makeDrawnFeature(feature, linkMode);
      return feature;
    });

    if (linkMode === "lines") {
      editDispatch({
        type: "add_drawn_line",
        payload: drawnFeatures,
        callback: updateMapDrawToolFeatures,
      });
    } else {
      editDispatch({
        type: "add_drawn_point",
        payload: drawnFeatures,
        callback: updateMapDrawToolFeatures,
      });
    }
  };

  const onUpdate = ({ features: updatedFeaturesArray, action }) => {
    const wasComponentDragged =
      action === "move" || action === "change_coordinates";
    if (!wasComponentDragged) return;

    // Features not yet saved have a string id generated by Mapbox GL Draw with hat
    // See: https://www.npmjs.com/package/hat
    const isNewFeature = typeof updatedFeaturesArray[0].id !== "number";

    // If we are updating an unsaved feature, we need to create it instead of update
    if (isNewFeature) {
      onCreate({ features: updatedFeaturesArray });
      return;
    }

    if (linkMode === "lines") {
      editDispatch({
        type: "update_drawn_lines",
        payload: updatedFeaturesArray,
        callback: updateMapDrawToolFeatures,
      });
    } else {
      editDispatch({
        type: "update_drawn_points",
        payload: updatedFeaturesArray,
        callback: updateMapDrawToolFeatures,
      });
    }
  };

  const onDelete = ({ features: deletedFeaturesArray }) => {
    if (linkMode === "lines") {
      editDispatch({
        type: "delete_drawn_lines",
        payload: deletedFeaturesArray,
      });
    } else {
      editDispatch({
        type: "delete_drawn_points",
        payload: deletedFeaturesArray,
      });
    }
    setIsDrawing(false);
    // after we have deleted, disable trash button
    setTrashButtonClickable(false);
  };

  const onModeChange = ({ mode }) => {
    if (isInDrawingMode(mode)) {
      setCursor("crosshair");
      setIsDrawing(true);
    } else {
      setIsDrawing(false);
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

export default EditComponentDrawTools;
