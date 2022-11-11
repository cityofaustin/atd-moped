import React, { useRef } from "react";
import ComponentsDrawControl from "src/components/Maps/ComponentsDrawControl";
import { makeDrawnFeature } from "./utils/features";
import { cloneDeep } from "lodash";

/**
 * Renders project component draw tools
 * @param {Function} setDraftComponent - function to update the draft component
 * @param {String} linkMode - tracks if we are editing "lines" or "points"
 * @param {Function} setCursor - function to update the cursor type
 * @param {Function} setIsDrawing - function to update if we are drawing or not
 * @returns {JSX.Element}
 */
const ComponentDrawTools = ({
  setDraftComponent,
  linkMode,
  setCursor,
  setIsDrawing,
}) => {
  const drawControlsRef = useRef();
  const shouldShowDrawControls = linkMode === "points" || linkMode === "lines";

  const onCreate = ({ features: createdFeaturesArray }) => {
    setDraftComponent((prevDraftComponent) => {
      const drawnFeatures = cloneDeep(createdFeaturesArray);

      const previouslyDrawnFeatures = cloneDeep(
        prevDraftComponent.features
      ).filter((feature) => !!feature.properties?.["DRAW_ID"]);

      // Add properties needed to distinguish drawn features from other features
      drawnFeatures.forEach((feature) => {
        makeDrawnFeature(feature, linkMode);
      });

      // We must override the features in the draw control's internal state with ones
      // that have our properties so that we can find them later in onDelete
      drawControlsRef.current.set({
        type: "FeatureCollection",
        features: [...previouslyDrawnFeatures, ...drawnFeatures],
      });

      return {
        ...prevDraftComponent,
        features: [...prevDraftComponent.features, ...drawnFeatures],
      };
    });
  };

  const onUpdate = ({ features: updatedFeaturesArray, action }) => {
    const wasComponentDragged = action === "move";

    if (wasComponentDragged) {
      setDraftComponent((prevDraftComponent) => {
        const featureIdsToUpdate = updatedFeaturesArray.map(
          (feature) => feature.properties["DRAW_ID"]
        );

        const draftFeaturesToKeep = prevDraftComponent.features.filter(
          (feature) => {
            if (feature.properties["DRAW_ID"]) {
              return !featureIdsToUpdate.includes(
                feature.properties["DRAW_ID"]
              );
            } else {
              return true;
            }
          }
        );

        return {
          ...prevDraftComponent,
          features: [...draftFeaturesToKeep, ...updatedFeaturesArray],
        };
      });
    }
  };

  const onDelete = ({ features: deletedFeaturesArray }) => {
    setDraftComponent((prevDraftComponent) => {
      const featureIdsToDelete = deletedFeaturesArray.map(
        (feature) => feature.properties["DRAW_ID"]
      );

      const draftFeaturesToKeep = prevDraftComponent.features.filter(
        (feature) => {
          if (feature.properties["DRAW_ID"]) {
            return !featureIdsToDelete.includes(feature.properties["DRAW_ID"]);
          } else {
            return true;
          }
        }
      );

      return {
        ...prevDraftComponent,
        features: [...draftFeaturesToKeep],
      };
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
