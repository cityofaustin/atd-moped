import { useState } from "react";

export const useUpdateComponent = ({ clickedComponent, setLinkMode }) => {
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
    // Collect table names and feature IDs to delete
    // Ex. {
    //  { 1 : {...featureGeoJSON}, 2: {...featureGeoJSON} },
    // }
    // Add/remove features as needed
    // OR
    // Go through table of draftEditComponent and update each feature's geometry
    // features without an id key are new features to insert
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
