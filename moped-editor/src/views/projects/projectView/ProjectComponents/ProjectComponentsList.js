import ComponentListItem from "./ComponentListItem";
import IconButton from "@mui/material/IconButton";
import TimelineIcon from "@mui/icons-material/Timeline";
import ListIcon from "@mui/icons-material/List";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { isSignalComponent } from "./utils/componentList";
import { ComponentIconByLineRepresentation } from "./utils/form";
import theme from "src/theme/index";

const ProjectComponentsList = ({
  createState,
  editState,
  editDispatch,
  clickedComponent,
  setClickedComponent,
  onClickZoomToComponent,
  onEditFeatures,
  projectComponents,
  setIsDeletingComponent,
  setIsMovingComponent,
  setIsClickedComponentRelated,
}) => {
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  const isExpanded = (component) =>
    clickedComponent?.project_component_id === component.project_component_id;

  const onListItemClick = (component) => {
    setIsClickedComponentRelated(false);
    // Clear clickedComponent and draftEditComponent when we are not selecting for edit
    if (isExpanded(component)) {
      setClickedComponent(null);
      editDispatch({ type: "clear_draft_component" });
    } else if (isNotCreatingOrEditing) {
      setClickedComponent(component);
      editDispatch({ type: "set_draft_component", payload: component });
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
    editDispatch({ type: "set_draft_component", payload: component });
  };

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
              <Tooltip title="Delete">
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    setIsDeletingComponent(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Move to another project">
                <IconButton
                  aria-label="move"
                  onClick={() => {
                    setIsMovingComponent(true);
                  }}
                >
                  <DriveFileMoveIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Details">
                <IconButton aria-label="edit" onClick={onEditAttributes}>
                  <ListIcon />
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
                    aria-label="map"
                    onClick={onEditMap}
                    disabled={isSignal}
                  >
                    <TimelineIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          }
        />
      );
    })
  );
};

export default ProjectComponentsList;
