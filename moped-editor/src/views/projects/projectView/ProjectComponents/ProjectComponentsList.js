import React, { useState, useEffect } from "react";
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

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

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

const ProjectComponentsList = ({
  editDispatch,
  onClickZoomToComponent,
  onEditFeatures,
  projectComponents,
  setIsDeletingComponent,
  setIsMovingComponent,
  setIsClickedComponentRelated,
  onListItemClick,
  isExpanded,
}) => {
  useWhatChanged({
    editDispatch,
    onClickZoomToComponent,
    onEditFeatures,
    projectComponents,
    setIsDeletingComponent,
    setIsMovingComponent,
    setIsClickedComponentRelated,
    isExpanded,
  });

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
            itemCount={projectComponents.length}
            height={height}
            width={width}
            itemSize={100}
          >
            {({ index, style }) =>
              projectComponents.map((component) => {
                const lineRepresentation =
                  component?.moped_components?.line_representation;
                const isSignal = isSignalComponent(component);
                const isComponentExpanded = isExpanded(component);
                const isComponentMapped = getIsComponentMapped(component);
                return (
                  <ComponentListItem
                    key={index}
                    style={style}
                    component={component}
                    isExpanded={isComponentExpanded}
                    onZoomClick={onZoomClick}
                    onListItemClick={onListItemClick}
                    Icon={
                      <ComponentIconByLineRepresentation
                        lineRepresentation={lineRepresentation}
                        color={theme.palette.primary.main}
                      />
                    }
                    selectedBorderColor={theme.palette.primary.main}
                    additionalCollapseListItems={
                      <Stack
                        spacing={2}
                        direction="row"
                        justifyContent="flex-end"
                        my={1}
                        // estimating alignment with zoom ListItemSecondaryAction button
                        mr={2.5}
                      >
                        <Tooltip title="Details">
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={onEditAttributes}
                          >
                            <EditNoteOutlinedIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            isSignal
                              ? "Signal locations can only be changed by editing the component details"
                              : "Map"
                          }
                        >
                          {/* this span allows the tooltip to display when IconButton is disabled */}
                          <span>
                            <IconButton
                              color="primary"
                              aria-label="map"
                              onClick={onEditMap}
                              disabled={isSignal}
                            >
                              <EditLocationAltOutlinedIcon
                                color={isComponentMapped ? undefined : "error"}
                              />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip
                          PopperProps={{
                            disablePortal: true,
                          }}
                          open={!!copiedUrl}
                          disableFocusListener
                          disableHoverListener
                          disableTouchListener
                          title="Copied!"
                          placement="top"
                        >
                          {/* This span prevents warning about providing title prop to child of Tooltip */}
                          <span>
                            <Tooltip
                              title="Copy link to component"
                              placement="bottom"
                            >
                              <IconButton
                                color="primary"
                                aria-label="link"
                                onClick={copyLinkToClipboard}
                              >
                                <LinkIcon />
                              </IconButton>
                            </Tooltip>
                          </span>
                        </Tooltip>

                        <Tooltip title="Move to another project">
                          <IconButton
                            color="primary"
                            aria-label="move"
                            onClick={onMoveComponentClick}
                          >
                            <DriveFileMoveOutlinedIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            color="primary"
                            aria-label="delete"
                            onClick={onDeleteComponentClick}
                          >
                            <DeleteOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  />
                );
              })
            }
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default ProjectComponentsList;
