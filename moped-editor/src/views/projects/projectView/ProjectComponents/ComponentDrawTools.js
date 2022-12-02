import React, { useRef } from "react";
import ComponentsDrawControl from "src/components/Maps/ComponentsDrawControl";
import { makeDrawnFeature, isDrawnFeature, getDrawId } from "./utils/features";
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
  createDispatch,
  createState,
  linkMode,
  setCursor,
  setIsDrawing,
}) => {
  const drawControlsRef = useRef();
  const shouldShowDrawControls = linkMode === "points" || linkMode === "lines";

  const onCreate = ({ features: createdFeaturesArray }) => {
    const prevDraftComponent = createState.draftComponent;

    const drawnFeatures = cloneDeep(createdFeaturesArray);

    const previouslyDrawnFeatures = cloneDeep(
      prevDraftComponent.features
    ).filter((feature) => Boolean(getDrawId(feature)));

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

    // const newDraftComponent = {
    //   ...prevDraftComponent,
    //   features: [...prevDraftComponent.features, ...drawnFeatures],
    // };

    createDispatch({
      type: "add_drawn_feature",
      payload: drawnFeatures,
    });
  };

  const onUpdate = ({ features: updatedFeaturesArray, action }) => {
    const wasComponentDragged = action === "move";

    if (wasComponentDragged) {
      const prevDraftComponent = createState.draftComponent;

      const featureIdsToUpdate = updatedFeaturesArray.map((feature) =>
        getDrawId(feature)
      );

      const draftFeaturesToKeep = prevDraftComponent.features.filter(
        (feature) => {
          if (isDrawnFeature(feature)) {
            return !featureIdsToUpdate.includes(getDrawId(feature));
          } else {
            return true;
          }
        }
      );

      const updatedDraftComponent = {
        ...prevDraftComponent,
        features: [...draftFeaturesToKeep, ...updatedFeaturesArray],
      };

      createDispatch({
        type: "store_draft_component",
        payload: updatedDraftComponent,
      });
    }
  };

  const onDelete = ({ features: deletedFeaturesArray }) => {
    const prevDraftComponent = createState.draftComponent;

    const featureIdsToDelete = deletedFeaturesArray.map((feature) =>
      getDrawId(feature)
    );

    const draftFeaturesToKeep = prevDraftComponent.features.filter(
      (feature) => {
        if (isDrawnFeature(feature)) {
          return !featureIdsToDelete.includes(getDrawId(feature));
        } else {
          return true;
        }
      }
    );

    const updatedDraftComponent = {
      ...prevDraftComponent,
      features: [...draftFeaturesToKeep],
    };

    createDispatch({
      type: "store_draft_component",
      payload: updatedDraftComponent,
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
