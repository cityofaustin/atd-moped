import React, { useEffect, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import ListItem from "@mui/material/ListItem";
import AutoSizer from "react-virtualized-auto-sizer";
import ProjectComponentListItem from "./ProjectComponentsList";

function useWhatChanged(props) {
  // cache the last set of props
  const prev = React.useRef(props);

  React.useEffect(() => {
    // check each prop to see if it has changed
    const changed = Object.entries(props).reduce((a, [key, prop]) => {
      if (prev.current[key] === prop) return a;
      return {
        ...a,
        [key]: {
          prev: prev.current[key],
          next: prop,
        },
      };
    }, {});

    if (Object.keys(changed).length > 0) {
      console.group("Props That Changed");
      console.log(changed);
      console.groupEnd();
    }

    prev.current = props;
  }, [props]);
}

const VirtualizedComponentsList = ({
  projectId,
  createState,
  editState,
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
  makeClickedComponentUpdates,
  onRelatedListItemClick,
}) => {
  useWhatChanged({
    projectId,
    createState,
    editState,
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
    makeClickedComponentUpdates,
    onRelatedListItemClick,
  });

  // TODO: Iterate the combineed list and use related or non-related to render the correct component
  // TODO: Virtualize the list
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
            itemSize={60}
            itemCount={allComponents.length}
          >
            {({ index, style }) => {
              const component = allComponents[index];
              const isProjectComponent =
                component.project_id === parseInt(projectId);

              return isProjectComponent ? (
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
              ) : (
                <ListItem
                  key={component.project_component_id}
                  style={style}
                >{`${component.project_component_id} - ${"Related"}`}</ListItem>
              );
            }}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedComponentsList;
