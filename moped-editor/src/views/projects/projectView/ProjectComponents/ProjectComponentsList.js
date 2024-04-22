import React, { useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
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
  onListItemClick,
  getIsExpanded,
  shouldShowRelatedProjects,
  onRelatedListItemClick,
}) => {
  const allComponents = useMemo(
    () => [...projectComponents, ...allRelatedComponents],
    [projectComponents, allRelatedComponents]
  );

  return (
    <div style={{ height: "100%" }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            className="List"
            height={height}
            width={width}
            itemSize={85}
            itemCount={allComponents.length}
          >
            {({ index, style }) => {
              const component = allComponents[index];
              const isProjectComponent =
                component.project_id === parseInt(projectId);

              if (isProjectComponent) {
                return (
                  <ProjectComponentListItem
                    editDispatch={editDispatch}
                    onClickZoomToComponent={onClickZoomToComponent}
                    onEditFeatures={onEditFeatures}
                    component={component}
                    setIsDeletingComponent={setIsDeletingComponent}
                    setIsMovingComponent={setIsMovingComponent}
                    setIsClickedComponentRelated={setIsClickedComponentRelated}
                    onListItemClick={onListItemClick}
                    getIsExpanded={getIsExpanded}
                    style={style}
                  />
                );
              } else if (shouldShowRelatedProjects && !isProjectComponent) {
                return (
                  <RelatedComponentsListItem
                    component={component}
                    onClickZoomToComponent={onClickZoomToComponent}
                    setIsClickedComponentRelated={setIsClickedComponentRelated}
                    getIsExpanded={getIsExpanded}
                    onRelatedListItemClick={onRelatedListItemClick}
                    style={style}
                  />
                );
              } else {
                return null;
              }
            }}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default ProjectComponentsList;
