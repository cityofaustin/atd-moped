import { useState } from "react";

export const useUpdateComponent = () => {
  /* if a component is being edited */
  const [isEditingComponent, setIsEditingComponent] = useState(false);
  const [showComponentEditDialog, setShowComponentEditDialog] = useState(false);

  const [showEditModeDialog, setShowEditModeDialog] = useState(false);

  /* holds the features added when editing an existing component */
  const [createdOnEditFeatures, setCreatedOnEditFeatures] = useState([]);

  return {
    isEditingComponent,
    setIsEditingComponent,
    showComponentEditDialog,
    setShowComponentEditDialog,
    showEditModeDialog,
    setShowEditModeDialog,
    createdOnEditFeatures,
    setCreatedOnEditFeatures,
  };
};
