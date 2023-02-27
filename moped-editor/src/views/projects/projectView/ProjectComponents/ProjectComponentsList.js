import ComponentListItem from "./ComponentListItem";

const ProjectComponentsList = ({
  createState,
  editState,
  editDispatch,
  clickedComponent,
  setClickedComponent,
  onClickZoomToComponent,
  projectComponents,
  setIsDeletingComponent,
}) => {
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  return (
    isNotCreatingOrEditing &&
    projectComponents.map((component) => {
      const isExpanded =
        clickedComponent?.project_component_id ===
        component.project_component_id;
      return (
        <ComponentListItem
          key={component.project_component_id}
          component={component}
          isExpanded={isExpanded}
          setClickedComponent={setClickedComponent}
          setIsDeletingComponent={setIsDeletingComponent}
          editDispatch={editDispatch}
          onClickZoomToComponent={onClickZoomToComponent}
          isEditingComponent={editState.isEditingComponent}
          isCreatingComponent={createState.isCreatingComponent}
        />
      );
    })
  );
};

export default ProjectComponentsList;
