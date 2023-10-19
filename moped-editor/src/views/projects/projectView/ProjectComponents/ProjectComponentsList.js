import { useState, useEffect } from "react";
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

const ProjectComponentsList = ({
  createState,
  editState,
  editDispatch,
  clickedComponent,
  onClickZoomToComponent,
  onEditFeatures,
  projectComponents,
  setIsDeletingComponent,
  setIsMovingComponent,
  setIsClickedComponentRelated,
  makeClickedComponentUpdates,
}) => {
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  const isExpanded = (component) =>
    clickedComponent?.project_component_id === component.project_component_id;

  const onListItemClick = (component) => {
    setIsClickedComponentRelated(false);
    // Clear clickedComponent and draftEditComponent when we are not selecting for edit
    if (isExpanded(component)) {
      makeClickedComponentUpdates(null);
      editDispatch({ type: "clear_draft_component" });
    } else if (isNotCreatingOrEditing) {
      makeClickedComponentUpdates(component);
    }
  };

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
    isNotCreatingOrEditing &&
    projectComponents.map((component) => {
      const lineRepresentation =
        component?.moped_components?.line_representation;
      const isSignal = isSignalComponent(component);
      return (
        <ComponentListItem
          key={component.project_component_id}
          component={component}
          isExpanded={isExpanded(component)}
          onZoomClick={() => onZoomClick(component)}
          onListItemClick={() => onListItemClick(component)}
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
                      color={
                        getIsComponentMapped(component) ? undefined : "error"
                      }
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
                  <Tooltip title="Copy link to component" placement="bottom">
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
                  onClick={() => {
                    setIsMovingComponent(true);
                  }}
                >
                  <DriveFileMoveOutlinedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton
                  color="primary"
                  aria-label="delete"
                  onClick={() => {
                    setIsDeletingComponent(true);
                  }}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />
      );
    })
  );
};

export default ProjectComponentsList;
