import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_PROJECT_COMPONENT } from "src/queries/components";

export const useCreateComponent = () => {
  /* if a new component is being created */
  const [isCreatingComponent, setIsCreatingComponent] = useState(false);
  const [showComponentCreateDialog, setShowComponentCreateDialog] =
    useState(false);

  /* holds the state of a component that's being created */
  const [draftComponent, setDraftComponent] = useState(null);

  const [addProjectComponent] = useMutation(ADD_PROJECT_COMPONENT);

  return {
    isCreatingComponent,
    setIsCreatingComponent,
    showComponentCreateDialog,
    setShowComponentCreateDialog,
    draftComponent,
    setDraftComponent,
    addProjectComponent,
  };
};
