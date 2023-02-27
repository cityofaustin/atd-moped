import RelatedComponentListItem from "./RelatedComponentListItem";

const RelatedComponentsList = ({
  createState,
  editState,
  shouldShowRelatedProjects,
  clickedComponent,
  setClickedComponent,
  onClickZoomToComponent,
  allRelatedComponents,
  setIsClickedComponentRelated,
}) => {
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  return (
    isNotCreatingOrEditing &&
    shouldShowRelatedProjects &&
    allRelatedComponents.map((component) => {
      const isExpanded =
        clickedComponent?.project_component_id ===
        component.project_component_id;
      return (
        <RelatedComponentListItem
          component={component}
          isExpanded={isExpanded}
          setClickedComponent={setClickedComponent}
          onClickZoomToComponent={onClickZoomToComponent}
          setIsClickedComponentRelated={setIsClickedComponentRelated}
        />
      );
    })
  );
};

export default RelatedComponentsList;
