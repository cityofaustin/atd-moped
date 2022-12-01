import { useState } from "react";

export const useUpdateComponent = ({
  components,
  clickedComponent,
  setLinkMode,
}) => {
  /* if a component is being edited */
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [showComponentEditDialog, setShowComponentEditDialog] = useState(false);

  const [showEditModeDialog, setShowEditModeDialog] = useState(false);

  /* holds the features added when editing an existing component */
  const [draftEditComponent, setDraftEditComponent] = useState(null);

  const onStartEditingComponent = () => {
    setShowEditModeDialog(true);
  };

  const onEditAttributes = () => {
    setShowComponentEditDialog(true);
    setShowEditModeDialog(false);
  };

  const onEditFeatures = () => {
    // TODO: Add helper to convert line representation to "lines" or "points"
    const {
      moped_components: { line_representation },
    } = clickedComponent;
    const linkMode = line_representation === true ? "lines" : "points";

    setLinkMode(linkMode);
    setIsEditingComponent(true);
    setShowEditModeDialog(false);
    console.log(clickedComponent);
    setDraftEditComponent(clickedComponent);
  };

  const onSaveEditedComponent = () => {
    console.log("Updating component");
    const tableToInsert =
      draftEditComponent?.[0]?.moped_components?.feature_layer?.internal_table;
    console.log(tableToInsert);
    // Collect table names and features IDs to update
    // 1. Find the draft component's original features in the components array
    // 2. Compare the draft features and original features to find the features that remain
    // 3. Make insertion data out of the new features
    // 4. Soft delete the ones that don't have a match in the edit draft

    // Collect table names and feature IDs to delete
  };

  const onCancelComponentAttributesEdit = () => {
    setShowEditModeDialog(false);
  };

  const onCancelComponentMapEdit = () => {
    setIsEditingComponent(false);
    setLinkMode(null);
    setDraftEditComponent(null);
  };

  return {
    isEditingComponent,
    setIsEditingComponent,
    showComponentEditDialog,
    setShowComponentEditDialog,
    showEditModeDialog,
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
