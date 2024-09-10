import { useCallback, useReducer } from "react";
import { useMutation } from "@apollo/client";
import {
  makeLineStringFeatureInsertionData,
  makePointFeatureInsertionData,
  makeDrawnLinesInsertionData,
  makeDrawnPointsInsertionData,
  addComponentIdForUpdate,
} from "./makeFeatures";
import { useDoesDraftEditComponentHaveFeatures } from "./features";
import { UPDATE_COMPONENT_FEATURES } from "src/queries/components";
import { zoomMapToFeatureCollection } from "./map";
import { useComponentFeatureCollection } from "./makeFeatureCollections";
import { fitBoundsOptions } from "../mapSettings";

const editReducer = (state, action) => {
  switch (action.type) {
    case "set_draft_component":
      const clickedComponent = action.payload;

      return {
        ...state,
        draftEditComponent: clickedComponent,
      };
    case "clear_draft_component":
      return {
        ...state,
        draftEditComponent: null,
      };
    case "start_attributes_edit":
      return {
        ...state,
        showEditAttributesDialog: true,
      };
    case "start_map_edit":
      return {
        ...state,
        isEditingComponent: true,
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
      };
    case "update_clicked_features":
      const updatedDraftEditComponent = action.callback(
        state.draftEditComponent
      );

      return { ...state, draftEditComponent: updatedDraftEditComponent };
    case "add_drawn_line":
      const newDrawnLineFeatures = action.payload;
      // Filter duplicates in the case we update an unsaved feature by dragging
      const existingDrawnLineFeatures =
        state.draftEditComponent.feature_drawn_lines.filter(
          (feature) => feature.id !== newDrawnLineFeatures[0].id
        );
      const featuresWithNewLines = [
        ...existingDrawnLineFeatures,
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
      // Filter duplicates in the case we update an unsaved feature by dragging
      const existingDrawnPointFeatures =
        state.draftEditComponent.feature_drawn_points.filter(
          (feature) => feature.id !== newDrawnPointFeatures[0].id
        );
      const featuresWithNewPoints = [
        ...existingDrawnPointFeatures,
        ...newDrawnPointFeatures,
      ];

      const draftEditComponentWithNewPoints = {
        ...state.draftEditComponent,
        feature_drawn_points: featuresWithNewPoints,
      };

      action.callback(featuresWithNewPoints);

      return { ...state, draftEditComponent: draftEditComponentWithNewPoints };
    case "update_drawn_lines":
      const updatedLineFeatures = action.payload;
      // We are only updating one feature at a time
      const lineFeatureToUpdate = updatedLineFeatures[0];
      const newLineGeometry = lineFeatureToUpdate.geometry;
      const existingDrawnLineFeatureToUpdate =
        state.draftEditComponent.feature_drawn_lines.find(
          (feature) => feature.id === lineFeatureToUpdate.id
        );
      const updatedDrawnLineFeature = {
        ...existingDrawnLineFeatureToUpdate,
        geometry: newLineGeometry,
      };
      const unchangedDrawnLineFeatures =
        state.draftEditComponent.feature_drawn_lines.filter(
          (feature) => feature.id !== lineFeatureToUpdate.id
        );

      const draftEditComponentWithDrawnLineUpdates = {
        ...state.draftEditComponent,
        feature_drawn_lines: [
          ...unchangedDrawnLineFeatures,
          updatedDrawnLineFeature,
        ],
      };

      action.callback([...unchangedDrawnLineFeatures, updatedDrawnLineFeature]);

      return {
        ...state,
        draftEditComponent: draftEditComponentWithDrawnLineUpdates,
        drawnLineFeatureUpdates: [
          ...state.drawnLineFeatureUpdates,
          updatedDrawnLineFeature,
        ],
      };
    case "update_drawn_points":
      const updatedPointFeatures = action.payload;
      // We are only updating one feature at a time
      const pointFeatureToUpdate = updatedPointFeatures[0];
      const newPointGeometry = pointFeatureToUpdate.geometry;
      const existingDrawnPointFeatureToUpdate =
        state.draftEditComponent.feature_drawn_points.find(
          (feature) => feature.id === pointFeatureToUpdate.id
        );
      const updatedDrawnPointFeature = {
        ...existingDrawnPointFeatureToUpdate,
        geometry: newPointGeometry,
      };
      const unchangedDrawnPointFeatures =
        state.draftEditComponent.feature_drawn_points.filter(
          (feature) => feature.id !== pointFeatureToUpdate.id
        );

      const draftEditComponentWithDrawnPointUpdates = {
        ...state.draftEditComponent,
        feature_drawn_points: [
          ...unchangedDrawnPointFeatures,
          updatedDrawnPointFeature,
        ],
      };

      action.callback([
        ...unchangedDrawnPointFeatures,
        updatedDrawnPointFeature,
      ]);

      return {
        ...state,
        draftEditComponent: draftEditComponentWithDrawnPointUpdates,
        drawnPointFeatureUpdates: [
          ...state.drawnPointFeatureUpdates,
          updatedDrawnPointFeature,
        ],
      };
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
  projectComponents,
  clickedComponent,
  setLinkMode,
  refetchProjectComponents,
  setIsDrawing,
  mapRef,
  makeClickedComponentUpdates,
}) => {
  const [editState, editDispatch] = useReducer(editReducer, {
    isEditingComponent: false,
    showEditAttributesDialog: false,
    draftEditComponent: null,
    drawnLineFeatureUpdates: [],
    drawnPointFeatureUpdates: [],
  });

  const doesDraftEditComponentHaveFeatures =
    useDoesDraftEditComponentHaveFeatures(editState.draftEditComponent);
  const draftEditComponentFeatureCollection = useComponentFeatureCollection(
    editState.draftEditComponent
  );

  const [updateComponentFeatures] = useMutation(UPDATE_COMPONENT_FEATURES);

  const onEditFeatures = useCallback(() => {
    const {
      moped_components: { line_representation },
    } = clickedComponent;
    const linkMode = line_representation === true ? "lines" : "points";

    setLinkMode(linkMode);
    editDispatch({ type: "start_map_edit" });
  }, [clickedComponent, setLinkMode]);

  const onSaveEditedComponent = () => {
    const featureTable =
      editState.draftEditComponent?.moped_components?.feature_layer
        ?.internal_table;

    const editedComponentId = editState.draftEditComponent.project_component_id;

    const originalComponent = projectComponents.find(
      (component) => component.project_component_id === editedComponentId
    );

    // Get the new features that are selected from a CTN layer
    const newFeaturesToInsert = editState.draftEditComponent[
      featureTable
    ].filter((feature) => !feature.id);
    // Get the new features that are drawn lines or points (not associated with a component yet)
    const newDrawnLines =
      editState.draftEditComponent.feature_drawn_lines.filter(
        (feature) => !feature.component_id
      );
    const newDrawnPoints =
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
      makeDrawnLinesInsertionData(newDrawnLines, drawnLinesToInsert);
    } else if (featureTable === "feature_intersections") {
      makePointFeatureInsertionData(
        featureTable,
        newFeaturesToInsert,
        intersections
      );
      makeDrawnPointsInsertionData(newDrawnPoints, drawnPointsToInsert);
    } else if (featureTable === "feature_signals") { //breadcrumb
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

    const drawnLinesDragUpdates = editState.drawnLineFeatureUpdates.map(
      (feature) => ({
        where: {
          _and: {
            component_id: {
              _eq: editState.draftEditComponent.project_component_id,
            },
            id: { _eq: feature.id },
          },
        },
        _set: { geography: feature.geometry },
      })
    );
    const drawnPointsDragUpdates = editState.drawnPointFeatureUpdates.map(
      (feature) => ({
        where: {
          _and: {
            component_id: {
              _eq: editState.draftEditComponent.project_component_id,
            },
            id: { _eq: feature.id },
          },
        },
        _set: { geography: feature.geometry },
      })
    );

    const streetSegmentInserts = addComponentIdForUpdate(
      streetSegments,
      editedComponentId
    );
    const intersectionInserts = addComponentIdForUpdate(
      intersections,
      editedComponentId
    );
    const signalInserts = addComponentIdForUpdate(signals, editedComponentId);
    const drawnLineInserts = addComponentIdForUpdate(
      drawnLinesToInsert,
      editedComponentId
    );
    const drawnPointInserts = addComponentIdForUpdate(
      drawnPointsToInsert,
      editedComponentId
    );

    updateComponentFeatures({
      variables: {
        updates: deletes,
        streetSegments: streetSegmentInserts,
        intersections: intersectionInserts,
        signals: signalInserts,
        drawnLines: drawnLineInserts,
        drawnPoints: drawnPointInserts,
        drawnLinesDragUpdates,
        drawnPointsDragUpdates,
      },
    })
      .then(() => {
        refetchProjectComponents().then(() => {
          makeClickedComponentUpdates(null);
          editDispatch({ type: "save_edit" });
          setLinkMode(null);
          setIsDrawing(false);

          zoomMapToFeatureCollection(
            mapRef,
            draftEditComponentFeatureCollection,
            fitBoundsOptions.zoomToClickedComponent
          );
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onCancelComponentMapEdit = () => {
    editDispatch({ type: "cancel_map_edit" });
    setLinkMode(null);
    setIsDrawing(false);
  };

  return {
    editDispatch,
    editState,
    onSaveEditedComponent,
    onCancelComponentMapEdit,
    onEditFeatures,
    doesDraftEditComponentHaveFeatures,
  };
};
