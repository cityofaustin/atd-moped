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

  const onSaveEditedComponent = () => {
    console.log("Updating component");
  };

  const onCancelComponentAttributesEdit = () => {
    setShowEditModeDialog(false);
  };

  const onCancelComponentMapEdit = () => {
    setIsEditingComponent(false);
    setLinkMode(null);
  };

  const onEditFeatures = () => {
    // TODO: Add helper to convert line representation to "lines" or "points"
    // TODO: Set clicked component as the draft component
    const {
      moped_components: { line_representation },
    } = clickedComponent;
    const linkMode = line_representation === true ? "lines" : "points";

    setLinkMode(linkMode);
    setIsEditingComponent(true);
    setShowEditModeDialog(false);
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
  };
};
