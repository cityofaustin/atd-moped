import React, { useMemo } from "react";
import List from "@mui/material/List";
import ProjectComponentListItem from "./ProjectComponentsListItem";
import RelatedComponentsListItem from "./RelatedComponentsListItem";

const ProjectComponentsList = ({
  projectId,
  editDispatch,
  onClickZoomToComponent,
  onEditFeatures,
  projectComponents,
  allRelatedComponents,
  setIsDeletingComponent,
  setIsMovingComponent,
  setIsClickedComponentRelated,
  getIsExpanded,
  shouldShowRelatedProjects,
  isNotCreatingOrEditing,
  makeClickedComponentUpdates,
}) => {
  const allComponents = useMemo(
    () => [...projectComponents, ...allRelatedComponents],
    [projectComponents, allRelatedComponents]
  );

  return (
    <List sx={{ paddingTop: 0 }}>
      {allComponents.map((component) => {
        const isProjectComponent = component.project_id === parseInt(projectId);
        const isExpanded = getIsExpanded(component);

        if (isProjectComponent) {
          return (
            <ProjectComponentListItem
              key={component.project_component_id}
              editDispatch={editDispatch}
              onClickZoomToComponent={onClickZoomToComponent}
              onEditFeatures={onEditFeatures}
              component={component}
              setIsDeletingComponent={setIsDeletingComponent}
              setIsMovingComponent={setIsMovingComponent}
              setIsClickedComponentRelated={setIsClickedComponentRelated}
              isExpanded={isExpanded}
              makeClickedComponentUpdates={makeClickedComponentUpdates}
              isNotCreatingOrEditing={isNotCreatingOrEditing}
            />
          );
        } else if (shouldShowRelatedProjects && !isProjectComponent) {
          return (
            <RelatedComponentsListItem
              key={component.project_component_id}
              component={component}
              onClickZoomToComponent={onClickZoomToComponent}
              setIsClickedComponentRelated={setIsClickedComponentRelated}
              isExpanded={isExpanded}
              makeClickedComponentUpdates={makeClickedComponentUpdates}
              isNotCreatingOrEditing={isNotCreatingOrEditing}
            />
          );
        } else {
          return null;
        }
      })}
    </List>
  );
};

export default ProjectComponentsList;
