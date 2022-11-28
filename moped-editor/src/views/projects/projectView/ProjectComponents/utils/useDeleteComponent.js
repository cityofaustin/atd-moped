import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_PROJECT_COMPONENT } from "src/queries/components";

export const useDeleteComponent = ({
  clickedComponent,
  setClickedComponent,
  refetchProjectComponents,
}) => {
  /* if a component is being deleted */
  const [isDeletingComponent, setIsDeletingComponent] = useState(false);

  const [deleteProjectComponent] = useMutation(DELETE_PROJECT_COMPONENT);

  const onDeleteComponent = () => {
    deleteProjectComponent({
      variables: { projectComponentId: clickedComponent.project_component_id },
    }).then(() => {
      refetchProjectComponents();
    });

    setClickedComponent(null);
    setIsDeletingComponent(false);
  };

  return {
    isDeletingComponent,
    setIsDeletingComponent,
    onDeleteComponent,
  };
};
