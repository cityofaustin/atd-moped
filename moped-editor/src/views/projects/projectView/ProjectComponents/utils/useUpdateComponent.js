import { useState, useReducer } from "react";

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
      };
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
  });

  /* holds the features added when editing an existing component */
  const [draftEditComponent, setDraftEditComponent] = useState(null);

  const onStartEditingComponent = () => {
    editDispatch({ type: "start_edit" });
  };

  const onEditAttributes = () => {
    editDispatch({ type: "start_attributes_edit" });
  };

  const onEditFeatures = () => {
    // TODO: Add helper to convert line representation to "lines" or "points"
    const {
      moped_components: { line_representation },
    } = clickedComponent;
    const linkMode = line_representation === true ? "lines" : "points";

    setLinkMode(linkMode);
    editDispatch({ type: "start_map_edit" });
    console.log(clickedComponent);
    setDraftEditComponent(clickedComponent);
  };

  const onSaveEditedComponent = () => {
    console.log("Updating component");
    const tableToInsert =
      draftEditComponent?.moped_components?.feature_layer?.internal_table;
    console.log(tableToInsert);
    // Collect table names and features IDs to update
    // 1. Find the draft component's original features in the components array
    // 2. Compare the draft features and original features to find the features that remain
    // 3. Make insertion data out of the new features
    // 4. Soft delete the ones that don't have a match in the edit draft

    // Collect table names and feature IDs to delete
  };

  const onCancelComponentAttributesEdit = () => {
    editDispatch({ type: "cancel_mode_edit" });
  };

  const onCancelComponentMapEdit = () => {
    editDispatch({ type: "cancel_map_edit" });
    setLinkMode(null);
    setDraftEditComponent(null);
  };

  return {
    editDispatch,
    editState,
    onStartEditingComponent,
    onSaveEditedComponent,
    onCancelComponentAttributesEdit,
    onCancelComponentMapEdit,
    onEditAttributes,
    onEditFeatures,
    draftEditComponent,
    setDraftEditComponent,
  };
};
