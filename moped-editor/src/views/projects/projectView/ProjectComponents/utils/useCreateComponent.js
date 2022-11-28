import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT_COMPONENT } from "src/queries/components";
import { onSaveComponent } from "./crud";

export const useCreateComponent = ({
  projectId,
  setClickedComponent,
  setLinkMode,
  refetchProjectComponents,
}) => {
  /* if a new component is being created */
  const [isCreatingComponent, setIsCreatingComponent] = useState(false);
  const [showComponentCreateDialog, setShowComponentCreateDialog] =
    useState(false);

  /* holds the state of a component that's being created */
  const [draftComponent, setDraftComponent] = useState(null);

  const [addProjectComponent] = useMutation(ADD_PROJECT_COMPONENT);

  const onStartCreatingComponent = () => {
    setIsCreatingComponent(true);
    setShowComponentCreateDialog(true);
    setClickedComponent(null);
  };

  const onSaveDraftComponent = () => {
    onSaveComponent({
      addProjectComponent,
      draftComponent,
      projectId,
      refetchProjectComponents,
      setDraftComponent,
      setIsCreatingComponent,
      setShowComponentCreateDialog,
      setLinkMode,
    });
  };

  const onCancelComponentCreate = () => {
    setIsCreatingComponent(!isCreatingComponent);
    setDraftComponent(null);
    setLinkMode(null);
  };

  return {
    isCreatingComponent,
    setIsCreatingComponent,
    showComponentCreateDialog,
    setShowComponentCreateDialog,
    draftComponent,
    setDraftComponent,
    onStartCreatingComponent,
    onSaveDraftComponent,
    onCancelComponentCreate,
  };
};
