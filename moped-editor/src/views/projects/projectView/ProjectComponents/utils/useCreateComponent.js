import { useReducer } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT_COMPONENT } from "src/queries/components";
import { makeComponentInsertData } from "./makeComponentData";
import { getDrawId, isDrawnDraftFeature } from "./features";
import { removeFeatureFromDraftComponent } from "./onMapClick";
import { zoomMapToFeatureCollection } from "./map";
import { fitBoundsOptions } from "../mapSettings";

const createReducer = (state, action) => {
  switch (action.type) {
    case "start_create":
      return {
        ...state,
        showCreateDialog: true,
      };
    case "save_create":
      return {
        ...state,
        showCreateDialog: false,
        isCreatingComponent: false,
        draftComponent: null,
      };
    case "cancel_create":
      return {
        ...state,
        showCreateDialog: false,
        isCreatingComponent: false,
        draftComponent: null,
      };
    case "close_create_dialog":
      return {
        ...state,
        showCreateDialog: false,
      };
    case "store_draft_component":
      return {
        ...state,
        draftComponent: action.payload,
        isCreatingComponent: true,
      };
    case "remove_draft_component_feature":
      const clickedDraftComponentFeature = action.payload;
      const draftComponentWithDeselectedFeatureRemoved =
        removeFeatureFromDraftComponent(
          state.draftComponent,
          clickedDraftComponentFeature
        );

      return {
        ...state,
        draftComponent: draftComponentWithDeselectedFeatureRemoved,
      };
    case "add_drawn_features":
      const newDrawnFeatures = action.payload;
      const featuresWithAdditions = [
        ...state.draftComponent.features,
        ...newDrawnFeatures,
      ];

      const newDraftComponent = {
        ...state.draftComponent,
        features: [...state.draftComponent.features, ...newDrawnFeatures],
      };

      // We only want drawn features to be fed into the map draw tools
      const drawToolsFeatureOverrides = featuresWithAdditions.filter(
        (feature) => isDrawnDraftFeature(feature)
      );
      action.callback(drawToolsFeatureOverrides);

      return { ...state, draftComponent: newDraftComponent };

    case "update_drawn_features":
      const updatedFeatures = action.payload;

      const featureIdsToUpdate = updatedFeatures.map((feature) =>
        getDrawId(feature)
      );

      const unchangedDraftFeatures = state.draftComponent.features.filter(
        (feature) => {
          if (isDrawnDraftFeature(feature)) {
            return !featureIdsToUpdate.includes(getDrawId(feature));
          } else {
            return true;
          }
        }
      );

      const draftComponentWithUpdates = {
        ...state.draftComponent,
        features: [...unchangedDraftFeatures, ...updatedFeatures],
      };

      return { ...state, draftComponent: draftComponentWithUpdates };
    case "delete_drawn_features":
      const deletedFeatures = action.payload;

      const featureIdsToDelete = deletedFeatures.map((feature) =>
        getDrawId(feature)
      );

      const draftFeaturesToKeep = state.draftComponent.features.filter(
        (feature) => {
          if (isDrawnDraftFeature(feature)) {
            return !featureIdsToDelete.includes(getDrawId(feature));
          } else {
            return true;
          }
        }
      );

      const draftComponentWithDeletes = {
        ...state.draftComponent,
        features: [...draftFeaturesToKeep],
      };

      return { ...state, draftComponent: draftComponentWithDeletes };
    default:
      throw Error(`Unknown action. ${action.type}`);
  }
};

export const useCreateComponent = ({
  projectId,
  setLinkMode,
  refetchProjectComponents,
  setIsDrawing,
  mapRef,
}) => {
  const [createState, createDispatch] = useReducer(createReducer, {
    isCreatingComponent: false,
    showCreateDialog: false,
    draftComponent: null,
  });

  const [addProjectComponent] = useMutation(ADD_PROJECT_COMPONENT);

  const onCancelComponentCreate = () => {
    createDispatch({ type: "cancel_create" });
    setLinkMode(null);
    setIsDrawing(false);
  };

  /**
   * Prepare component and feature data for component creation and call mutation/reset state
   */
  const onSaveDraftComponent = () => {
    const { draftComponent } = createState;
    const newComponentData = makeComponentInsertData(projectId, draftComponent);

    addProjectComponent({ variables: { object: newComponentData } })
      .then(() => {
        refetchProjectComponents().then(() => {
          createDispatch({ type: "save_create" });
          setLinkMode(null);
          setIsDrawing(false);
          zoomMapToFeatureCollection(
            mapRef,
            {
              type: "FeatureCollection",
              features: draftComponent.features,
            },
            fitBoundsOptions.zoomToClickedComponent
          );
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * Prepare signal component and feature data for component creation and call mutation/reset state
   */
  // should this be updated or duplicated -- or maybe it just works as is
  const onSaveDraftSignalComponent = (signalComponent) => {
    const newComponentData = makeComponentInsertData(
      projectId,
      signalComponent
    );

    addProjectComponent({ variables: { object: newComponentData } })
      .then(() => {
        refetchProjectComponents().then(() => {
          createDispatch({ type: "save_create" });
          setLinkMode(null);
          setIsDrawing(false);
          zoomMapToFeatureCollection(
            mapRef,
            {
              type: "FeatureCollection",
              features: signalComponent.features,
            },
            fitBoundsOptions.zoomToClickedComponent
          );
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return {
    createState,
    createDispatch,
    onSaveDraftComponent,
    onSaveDraftSignalComponent,
    onCancelComponentCreate,
  };
};
