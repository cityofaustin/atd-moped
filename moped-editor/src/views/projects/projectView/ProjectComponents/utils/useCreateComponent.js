import { useState, useReducer } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT_COMPONENT } from "src/queries/components";
import {
  makeDrawnLinesInsertionData,
  makeDrawnPointsInsertionData,
  makeLineStringFeatureInsertionData,
  makePointFeatureInsertionData,
} from "./makeFeatures";
import { getDrawId } from "./features";

const createReducer = (state, action) => {
  if (action.type === "start_create") {
    return {
      ...state,
      showCreateDialog: true,
      isCreatingComponent: true,
    };
  } else if (action.type === "save_create") {
    return {
      ...state,
      showCreateDialog: false,
      isCreatingComponent: false,
      draftComponent: null,
    };
  } else if (action.type === "cancel_create") {
    return {
      ...state,
      showCreateDialog: false,
      isCreatingComponent: false,
      draftComponent: null,
    };
  } else if (action.type === "close_create_dialog") {
    return {
      ...state,
      showCreateDialog: false,
    };
  } else if (action.type === "store_draft_component") {
    const draftComponent = action.payload;

    return { ...state, draftComponent };
  }
  throw Error(`Unknown action. ${action.type}`);
};

export const useCreateComponent = ({
  projectId,
  setClickedComponent,
  setLinkMode,
  refetchProjectComponents,
}) => {
  const [createState, createDispatch] = useReducer(createReducer, {
    isCreatingComponent: false,
    showCreateDialog: false,
    draftComponent: null,
  });

  /* if a new component is being created */

  const [addProjectComponent] = useMutation(ADD_PROJECT_COMPONENT);

  const onStartCreatingComponent = () => {
    createDispatch({ type: "start_create" });
    setClickedComponent(null);
  };

  const onCancelComponentCreate = () => {
    createDispatch({ type: "cancel_create" });
    setLinkMode(null);
  };

  const onSaveDraftComponent = () => {
    /* Start data preparation */
    const {
      component_id,
      description,
      moped_subcomponents,
      component_name,
      internal_table,
      features,
    } = createState.draftComponent;

    const subcomponentsArray = moped_subcomponents
      ? moped_subcomponents.map((subcomponent) => ({
          subcomponent_id: subcomponent.value,
        }))
      : [];

    const featureTable = internal_table;

    const featuresToInsert = [];
    const drawnLinesToInsert = [];
    const drawnPointsToInsert = [];

    const drawnFeatures = features.filter((feature) =>
      Boolean(getDrawId(feature))
    );
    const selectedFeatures = features.filter(
      (feature) => !Boolean(getDrawId(feature))
    );

    if (featureTable === "feature_street_segments") {
      makeLineStringFeatureInsertionData(
        featureTable,
        selectedFeatures,
        featuresToInsert
      );
      makeDrawnLinesInsertionData(drawnFeatures, drawnLinesToInsert);
    } else if (
      featureTable === "feature_intersections" ||
      featureTable === "feature_signals"
    ) {
      makePointFeatureInsertionData(
        featureTable,
        selectedFeatures,
        featuresToInsert
      );
      makeDrawnPointsInsertionData(drawnFeatures, drawnPointsToInsert);
    }

    const newComponentData = {
      description,
      component_id,
      name: component_name,
      project_id: projectId,
      moped_proj_components_subcomponents: {
        data: subcomponentsArray,
      },
      [featureTable]: {
        data: featuresToInsert,
      },
      feature_drawn_lines: { data: drawnLinesToInsert },
      feature_drawn_points: { data: drawnPointsToInsert },
    };
    /* End data preparation */

    addProjectComponent({ variables: { object: newComponentData } }).then(
      () => {
        refetchProjectComponents();
      }
    );

    createDispatch({ type: "save_create" });
    setLinkMode(null);
  };

  return {
    createState,
    createDispatch,
    onStartCreatingComponent,
    onSaveDraftComponent,
    onCancelComponentCreate,
  };
};
