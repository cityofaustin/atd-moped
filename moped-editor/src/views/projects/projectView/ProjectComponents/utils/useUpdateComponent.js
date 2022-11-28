import { useState } from "react";
import { onUpdateComponent } from "./crud";

export const useUpdateComponent = ({ setLinkMode }) => {
  /* if a component is being edited */
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [showComponentEditDialog, setShowComponentEditDialog] = useState(false);

  const [showEditModeDialog, setShowEditModeDialog] = useState(false);

  /* holds the features added when editing an existing component */
  const [createdOnEditFeatures, setCreatedOnEditFeatures] = useState([]);

  const onStartEditingComponent = () => {
    setShowEditModeDialog(true);
  };

  const onEditAttributes = () => {
    setShowComponentEditDialog(true);
    setShowEditModeDialog(false);
  };

  const onSaveEditedComponent = () => {
    onUpdateComponent({ createdOnEditFeatures });
  };

  const onCancelComponentAttributesEdit = () => {
    setShowEditModeDialog(false);
  };

  const onCancelComponentMapEdit = () => {
    setIsEditingComponent(false);
    setCreatedOnEditFeatures([]);
    setLinkMode(null);
  };

  return {
    isEditingComponent,
    setIsEditingComponent,
    showComponentEditDialog,
    setShowComponentEditDialog,
    showEditModeDialog,
    setShowEditModeDialog,
    createdOnEditFeatures,
    setCreatedOnEditFeatures,
    onStartEditingComponent,
    onSaveEditedComponent,
    onCancelComponentAttributesEdit,
    onCancelComponentMapEdit,
    onEditAttributes,
  };
};
