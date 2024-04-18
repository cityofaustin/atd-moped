import React, { useState, useEffect, useMemo } from "react";
import ComponentListItem from "./ComponentListItem";
import IconButton from "@mui/material/IconButton";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditLocationAltOutlinedIcon from "@mui/icons-material/EditLocationAltOutlined";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import LinkIcon from "@mui/icons-material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { isSignalComponent } from "./utils/componentList";
import { ComponentIconByLineRepresentation } from "./utils/form";
import { getIsComponentMapped } from "./utils/componentList";
import theme from "src/theme/index";

import { FixedSizeList as List } from "react-window";
import ListItem from "@mui/material/ListItem";
import AutoSizer from "react-virtualized-auto-sizer";

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

  // TODO: Combine proejct and related components
  // TODO: Update project and related list components to render a single row
  // TODO: Iterate the combineed list and use related or non-related to render the correct component
  // TODO: Virtualize the list
  const allComponents = useMemo(
    () => [...projectComponents, ...allRelatedComponents],
    [projectComponents, allRelatedComponents]
  );

  const onEditAttributes = () =>
    editDispatch({ type: "start_attributes_edit" });

  const onEditMap = () => {
    editDispatch({ type: "start_map_edit" });
    onEditFeatures();
  };

  const onZoomClick = (component) => {
    onClickZoomToComponent(component);
    setIsClickedComponentRelated(false);
  };

  const onMoveComponentClick = () => {
    setIsMovingComponent(true);
  };

  const onDeleteComponentClick = () => {
    setIsDeletingComponent(true);
  };

  /* Component link copy button */
  const [copiedUrl, setCopiedUrl] = useState(null);

  const copyLinkToClipboard = () => {
    const currentUrl = window.location.href;
    setCopiedUrl(currentUrl);
    return navigator.clipboard.writeText(currentUrl);
  };

  useEffect(() => {
    /**
     * Effect which closes the tooltip after a brief pause
     */
    if (!copiedUrl) return;
    const timeout = setTimeout(() => {
      setCopiedUrl(null);
    }, 500);
    return () => clearTimeout(timeout);
  }, [copiedUrl, setCopiedUrl]);

  return (
    <div style={{ height: "100%" }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            className="List"
            height={height}
            width={width}
            itemSize={40}
            itemCount={allComponents.length}
          >
            {({ style }) =>
              allComponents.map((component) => {
                return (
                  <ListItem
                    key={component.project_component_id}
                    style={style}
                  >{`${component.project_component_id} - ${
                    component.project_id === parseInt(projectId)
                      ? "Current project"
                      : "Related"
                  }`}</ListItem>
                );
              })
            }
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedComponentsList;
