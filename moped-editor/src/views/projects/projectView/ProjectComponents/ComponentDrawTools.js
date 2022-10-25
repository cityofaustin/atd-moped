import React, { useRef } from "react";
import ComponentsDrawControl from "src/components/Maps/ComponentsDrawControl";
import { cloneDeep } from "lodash";
import { v4 as uuidv4 } from "uuid";

const ComponentDrawTools = ({
  draftComponent,
  setDraftComponent,
  linkMode,
  setCursor,
}) => {
  const drawControlsRef = useRef();
  const shouldShowDrawControls = linkMode === "points" || linkMode === "lines";

  //   console.log({ draftComponent });
  // TODO: Add/update/remove draftComponent.features

  const onCreate = ({ features: createdFeaturesArray }) => {
    setDraftComponent((prevDraftComponent) => {
      const drawnFeatures = cloneDeep(createdFeaturesArray);

      const previouslyDrawnFeatures = cloneDeep(
        prevDraftComponent.features
      ).filter((feature) => !!feature.properties?.["DRAW_ID"]);
      console.log({ previouslyDrawnFeatures });

      // Add a unique id to each drawn feature's properties
      drawnFeatures.forEach(
        (feature) => (feature.properties["DRAW_ID"] = uuidv4())
      );

      // We must override the draw control's features with ones that have "DRAW_ID" properties
      // so that we can access them when we want to delete them by UUID before saving
      drawControlsRef.current.set({
        type: "FeatureCollection",
        features: [...previouslyDrawnFeatures, ...drawnFeatures],
      });

      console.log(prevDraftComponent.features, drawnFeatures);

      return {
        ...prevDraftComponent,
        features: [...prevDraftComponent.features, ...drawnFeatures],
      };
    });
  };

  const onUpdate = ({ features: updatedFeaturesArray, action }) => {
    console.log({ updatedFeaturesArray, action, draftComponent });

    // TODO: look at action type, iterate updatedFeaturesArray, update IDs with uuids and add to draftComponent.features
    // probably most concerned with drag updates (action === "move")
  };

  const onDelete = ({ features: deletedFeaturesArray }) => {
    console.log(deletedFeaturesArray);

    // const draftFeaturesToKeep = draftComponent.features.filter(feature => {})

    // TODO: iterate deletedFeaturesArray and remove those from the draft feature
  };

  const onModeChange = (e) => {
    // If we are not drawing, set isDrawing to false so we can select layer features as components
    const { mode } = e;

    // TODO: Move this back to isDrawing state toggle and control cursor in the map component
    // Handle isHovering the same way so that one isn't overriding the other
    if (mode === "draw_point" || mode === "draw_line_string") {
      setCursor("crosshair");
    } else {
      setCursor("grab");
    }
  };

  const initializeExistingDrawFeatures = () => {
    console.log("initializeExistingDrawFeatures");
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
