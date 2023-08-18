import ComponentListItem from "./ComponentListItem";
import Button from "@mui/material/Button";
import TimelineIcon from "@mui/icons-material/Timeline";
import ListIcon from "@mui/icons-material/List";
import DeleteIcon from "@mui/icons-material/Delete";
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
  projectComponents,
  setIsDeletingComponent,
  setIsClickedComponentRelated,
}) => {
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  const isExpanded = (component) =>
    clickedComponent?.project_component_id === component.project_component_id;

  const onListItemClick = (component) => {
    setIsClickedComponentRelated(false);
    // If we are editing a component, clicking on a component should not change the clicked component
    if (isExpanded(component)) {
      setClickedComponent(null);
    } else if (isNotCreatingOrEditing) {
      setClickedComponent(component);
    }
  };

  const onStartEditingComponent = (component) => {
    if (isSignalComponent(component)) {
      editDispatch({ type: "start_attributes_edit" });
    } else {
      editDispatch({ type: "start_edit", payload: component });
    }
  };

  const onZoomClick = (component) => {
    onClickZoomToComponent(component);
    setIsClickedComponentRelated(false);
  };

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
                  <Button
                    fullWidth
                    size="small"
                    style={{ color: theme.palette.text.primary }}
                    startIcon={<DeleteIcon />}
                    onClick={() => setIsDeletingComponent(true)}
                  >
                    Delete
                  </Button>
                }
              />
              <ListItemText
                primary={
                  <Button
                    fullWidth
                    size="small"
                    color="primary"
                    startIcon={<ListIcon />}
                    onClick={() => onStartEditingComponent(component)}
                  >
                    Attributes
                  </Button>
                }
              />
              <ListItemText
                primary={
                  <Button
                    fullWidth
                    size="small"
                    color="primary"
                    startIcon={<TimelineIcon />}
                    onClick={() => onStartEditingComponent(component)}
                  >
                    Map
                  </Button>
                }
              />
            </ListItem>
          }
        />
      );
    })
  );
};

export default ProjectComponentsList;

// TODO: Check dispatch messages:
// start_attributes_edit
// vs. start_edit
// to make sure that we don't miss any events
// Looks like we jump straight to start_attributes_edit for signal components
// so we might already be good
// TODO: Add new attributes and map buttons
// TODO: Update click actions to bypass EditModeDialog
// TODO: Remove EditModeDialog
// TODO: Test signal and non-signal components
// TODO: for the details button, use the same list icon used for the "Attributes" button
// TODO: for map button, use the same timeline icon used for the "Map" button
