import ComponentListItem from "./ComponentListItem";
import IconButton from "@mui/material/IconButton";
import TimelineIcon from "@mui/icons-material/Timeline";
import ListIcon from "@mui/icons-material/List";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
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

  // TODO: Update buttons icon buttons
  // TODO: Add move button with isMovingComponent state
  // TODO: Add move component modal that shows up when move button is clicked
  // TODO: Copy form from create component modal and adapt it to autocomplete project IDs
  // TODO: auto-focused autocomplete input
  // TODO: Form save button on enables when a new project ID is selected
  // TODO: Align rightmost button with the zoom button above it
  // TODO: Show tooltips on hover for each button
  // - "Delete"
  // - "Move to another project"
  // - "Details"
  // - "Map"

  return (
    isNotCreatingOrEditing &&
    projectComponents.map((component) => {
      const lineRepresentation =
        component?.moped_components?.line_representation;
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
            <ListItem dense disableGutters>
              <ListItemText
                primary={
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setIsDeletingComponent(true);
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              />
              <ListItemText
                primary={
                  <IconButton
                    aria-label="move"
                    onClick={() => {
                      console.log("open move modal");
                    }}
                    size="small"
                  >
                    <DriveFileMoveIcon />
                  </IconButton>
                }
              />
              <ListItemText
                primary={
                  <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={onEditAttributes}
                  >
                    <ListIcon />
                  </IconButton>
                }
              />
              {!isSignalComponent(component) && (
                <ListItemText
                  primary={
                    <IconButton
                      aria-label="map"
                      size="small"
                      onClick={onEditMap}
                    >
                      <TimelineIcon />
                    </IconButton>
                  }
                />
              )}
            </ListItem>
          }
        />
      );
    })
  );
};

export default ProjectComponentsList;
