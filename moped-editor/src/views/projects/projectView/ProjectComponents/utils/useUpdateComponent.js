import { useReducer } from "react";
import {
  makeLineStringFeatureInsertionData,
  makePointFeatureInsertionData,
} from "./makeFeatures";
import { SOURCES } from "../mapSettings";

const editReducer = (state, action) => {
  switch (action.type) {
    case "start_edit":
      return {
        ...state,
        showEditModeDialog: true,
      };
    case "start_attributes_edit":
      return {
        ...state,
        showEditModeDialog: false,
        showEditAttributesDialog: true,
      };
    case "start_map_edit":
      return {
        ...state,
        showEditModeDialog: false,
        isEditingComponent: true,
        draftEditComponent: action.payload,
      };
    case "cancel_mode_edit":
      return {
        ...state,
        showEditModeDialog: false,
        isEditingComponent: false,
      };
    case "cancel_attributes_edit":
      return {
        ...state,
        showEditAttributesDialog: false,
        isEditingComponent: false,
      };
    case "cancel_map_edit":
      return {
        ...state,
        isEditingComponent: false,
        draftEditComponent: null,
      };
    case "update_clicked_features":
      const updatedDraftEditComponent = action.callback(
        state.draftEditComponent
      );

      return { ...state, draftEditComponent: updatedDraftEditComponent };
    default:
      throw Error(`Unknown action. ${action.type}`);
  }
};

export const useUpdateComponent = ({
  components,
  clickedComponent,
  setLinkMode,
}) => {
  const [editState, editDispatch] = useReducer(editReducer, {
    isEditingComponent: false,
    showEditAttributesDialog: false,
    showEditModeDialog: false,
    draftEditComponent: null,
  });

  const onEditFeatures = () => {
    // TODO: Add helper to convert line representation to "lines" or "points"
    const {
      moped_components: { line_representation },
    } = clickedComponent;
    const linkMode = line_representation === true ? "lines" : "points";

    setLinkMode(linkMode);
    editDispatch({ type: "start_map_edit", payload: clickedComponent });
    console.log(clickedComponent);
  };

  const onSaveEditedComponent = () => {
    const featureTable =
      editState.draftEditComponent?.moped_components?.feature_layer
        ?.internal_table;

    console.log(featureTable, editState.draftEditComponent);

    const editedComponentId = editState.draftEditComponent.project_component_id;

    const originalComponent = components.find(
      (component) => component.project_component_id === editedComponentId
    );

    // Get the new features
    const newFeaturesToInsert = editState.draftEditComponent[
      featureTable
    ].filter((feature) => !feature.id);

    const featuresToInsert = [];

    if (featureTable === "feature_street_segments") {
      makeLineStringFeatureInsertionData(
        featureTable,
        newFeaturesToInsert,
        featuresToInsert
      );
    } else if (
      featureTable === "feature_intersections" ||
      featureTable === "feature_signals"
    ) {
      makePointFeatureInsertionData(
        featureTable,
        newFeaturesToInsert,
        featuresToInsert
      );
    }

    // Find the features to delete
    const originalFeaturesToDelete = originalComponent[featureTable].filter(
      (feature) => {
        const { id } = feature;
        return !editState.draftEditComponent[featureTable].find(
          (feature) => feature.id === id
        );
      }
    );

    // Collect table names and features IDs to update
    // 1. Find the draft component's original features in the components array
    // 2. Compare the draft features and original features to find the features that remain
    // 3. Make insertion data out of the new features
    // 4. Soft delete the ones that don't have a match in the edit draft

    // Collect table names and feature IDs to delete
  };

  const onCancelComponentMapEdit = () => {
    editDispatch({ type: "cancel_map_edit" });
    setLinkMode(null);
  };

  return {
    editDispatch,
    editState,
    onSaveEditedComponent,
    onCancelComponentMapEdit,
    onEditFeatures,
  };
};
