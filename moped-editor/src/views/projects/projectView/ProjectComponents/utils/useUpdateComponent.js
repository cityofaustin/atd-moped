import { useReducer } from "react";
import { useMutation } from "@apollo/client";
import {
  makeLineStringFeatureInsertionData,
  makePointFeatureInsertionData,
  makeDrawnLinesInsertionData,
  makeDrawnPointsInsertionData,
} from "./makeFeatures";
import { UPDATE_COMPONENT_FEATURES } from "src/queries/components";
import { getDrawId } from "./features";

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
    case "add_drawn_line":
      const newDrawnLineFeatures = action.payload;
      const featuresWithNewLines = [
        ...state.draftEditComponent.feature_drawn_lines,
        ...newDrawnLineFeatures,
      ];

      const draftEditComponentWithNewLines = {
        ...state.draftEditComponent,
        feature_drawn_lines: featuresWithNewLines,
      };

      action.callback(featuresWithNewLines);

      return { ...state, draftEditComponent: draftEditComponentWithNewLines };
    case "add_drawn_point":
      const newDrawnPointFeatures = action.payload;
      const featuresWithNewPoints = [
        ...state.draftEditComponent.feature_drawn_points,
        ...newDrawnPointFeatures,
      ];

      const draftEditComponentWithNewPoints = {
        ...state.draftEditComponent,
        feature_drawn_points: featuresWithNewPoints,
      };

      action.callback(featuresWithNewPoints);

      return { ...state, draftEditComponent: draftEditComponentWithNewPoints };
    case "delete_drawn_lines":
      const deletedLineFeatures = action.payload;

      const lineIdsToDelete = deletedLineFeatures.map((feature) => feature.id);

      const draftLineFeaturesToKeep =
        state.draftEditComponent.feature_drawn_lines.filter(
          (feature) => !lineIdsToDelete.includes(feature.id)
        );

      const draftComponentWithLineDeletes = {
        ...state.draftEditComponent,
        feature_drawn_lines: draftLineFeaturesToKeep,
      };

      return { ...state, draftEditComponent: draftComponentWithLineDeletes };
    case "delete_drawn_points":
      const deletedPointFeatures = action.payload;

      const pointIdsToDelete = deletedPointFeatures.map(
        (feature) => feature.id
      );

      const draftPointFeaturesToKeep =
        state.draftEditComponent.feature_drawn_points.filter(
          (feature) => !pointIdsToDelete.includes(feature.id)
        );

      const draftComponentWithPointDeletes = {
        ...state.draftEditComponent,
        feature_drawn_points: draftPointFeaturesToKeep,
      };

      return { ...state, draftEditComponent: draftComponentWithPointDeletes };
    case "save_edit":
      return {
        ...state,
        isEditingComponent: false,
        draftEditComponent: null,
      };
    default:
      throw Error(`Unknown action. ${action.type}`);
  }
};

export const useUpdateComponent = ({
  components,
  clickedComponent,
  setClickedComponent,
  setLinkMode,
  refetchProjectComponents,
}) => {
  const [editState, editDispatch] = useReducer(editReducer, {
    isEditingComponent: false,
    showEditAttributesDialog: false,
    showEditModeDialog: false,
    draftEditComponent: null,
  });

  const [updateComponentFeatures] = useMutation(UPDATE_COMPONENT_FEATURES);

  const onEditFeatures = () => {
    const {
      moped_components: { line_representation },
    } = clickedComponent;
    const linkMode = line_representation === true ? "lines" : "points";

    setLinkMode(linkMode);
    editDispatch({ type: "start_map_edit", payload: clickedComponent });
  };

  const onSaveEditedComponent = () => {
    const featureTable =
      editState.draftEditComponent?.moped_components?.feature_layer
        ?.internal_table;

    const editedComponentId = editState.draftEditComponent.project_component_id;

    const originalComponent = components.find(
      (component) => component.project_component_id === editedComponentId
    );

    // Get the new features that are selected from a CTN layer
    const newFeaturesToInsert = editState.draftEditComponent[
      featureTable
    ].filter((feature) => !feature.id);
    // Get the new features that are drawn lines or points (not associated with a component yet)
    const drawnLines = editState.draftEditComponent.feature_drawn_lines.filter(
      (feature) => !feature.component_id
    );
    const drawnPoints =
      editState.draftEditComponent.feature_drawn_points.filter(
        (feature) => !feature.component_id
      );

    const streetSegments = [];
    const intersections = [];
    const signals = [];
    const drawnLinesToInsert = [];
    const drawnPointsToInsert = [];

    if (featureTable === "feature_street_segments") {
      makeLineStringFeatureInsertionData(
        featureTable,
        newFeaturesToInsert,
        streetSegments
      );
      makeDrawnLinesInsertionData(drawnLines, drawnLinesToInsert);
    } else if (featureTable === "feature_intersections") {
      makePointFeatureInsertionData(
        featureTable,
        newFeaturesToInsert,
        intersections
      );
      makeDrawnPointsInsertionData(drawnPoints, drawnPointsToInsert);
    } else if (featureTable === "feature_signals") {
      makePointFeatureInsertionData(featureTable, newFeaturesToInsert, signals);
    }

    // Find the features to delete
    const featuresToDelete = originalComponent[featureTable].filter(
      (feature) => {
        const { id } = feature;
        return !editState.draftEditComponent[featureTable].find(
          (feature) => feature.id === id
        );
      }
    );
    const drawnLinesToDelete = originalComponent.feature_drawn_lines.filter(
      (feature) => {
        const { id } = feature;
        return !editState.draftEditComponent.feature_drawn_lines.find(
          (feature) => feature.id === id
        );
      }
    );
    const drawnPointsToDelete = originalComponent.feature_drawn_points.filter(
      (feature) => {
        const { id } = feature;
        return !editState.draftEditComponent.feature_drawn_points.find(
          (feature) => feature.id === id
        );
      }
    );
    const allFeaturesToDelete = [
      ...featuresToDelete,
      ...drawnLinesToDelete,
      ...drawnPointsToDelete,
    ];

    const deletes = allFeaturesToDelete.map((feature) => ({
      where: {
        _and: {
          component_id: {
            _eq: editState.draftEditComponent.project_component_id,
          },
          id: { _eq: feature.id },
        },
      },
      _set: { is_deleted: true },
    }));

    const streetSegmentsWithComponentId = streetSegments.map((feature) => ({
      ...feature,
      component_id: editedComponentId,
    }));

    const intersectionsWithComponentId = intersections.map((feature) => ({
      ...feature,
      component_id: editedComponentId,
    }));

    const signalsWithComponentId = signals.map((feature) => ({
      ...feature,
      component_id: editedComponentId,
    }));

    const drawnLinesWithComponentId = drawnLinesToInsert.map((feature) => ({
      ...feature,
      component_id: editedComponentId,
    }));

    const drawnPointsWithComponentId = drawnPointsToInsert.map((feature) => ({
      ...feature,
      component_id: editedComponentId,
    }));

    updateComponentFeatures({
      variables: {
        updates: deletes,
        streetSegments: streetSegmentsWithComponentId,
        intersections: intersectionsWithComponentId,
        signals: signalsWithComponentId,
        drawnLines: drawnLinesWithComponentId,
        drawnPoints: drawnPointsWithComponentId,
      },
    })
      .then(() => {
        refetchProjectComponents();
        setClickedComponent(null);
        editDispatch({ type: "save_edit" });
      })
      .catch((error) => {
        console.log(error);
      });
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
