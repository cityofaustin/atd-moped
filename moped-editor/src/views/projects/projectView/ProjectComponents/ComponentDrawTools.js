import React, { useRef } from "react";
import ComponentsDrawControl from "src/components/Maps/ComponentsDrawControl";
import { makeDrawnFeature } from "./featureUtils";
import { cloneDeep } from "lodash";

const ComponentDrawTools = ({
  draftComponent,
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

  const onModeChange = (e) => {
    const { mode } = e;

    if (mode === "draw_point" || mode === "draw_line_string") {
      setCursor("crosshair");
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
        initializeExistingDrawFeatures={initializeExistingDrawFeatures}
      />
    )
  );
};

export default ComponentDrawTools;
