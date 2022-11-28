import { useState } from "react";

export const useCreateComponent = () => {
  /* if a new component is being created */
  const [isCreatingComponent, setIsCreatingComponent] = useState(false);
  const [showComponentCreateDialog, setShowComponentCreateDialog] =
    useState(false);

  /* holds the state of a component that's being created */
  const [draftComponent, setDraftComponent] = useState(null);

  return {
    isCreatingComponent,
    setIsCreatingComponent,
    showComponentCreateDialog,
    setShowComponentCreateDialog,
    draftComponent,
    setDraftComponent,
  };
};
