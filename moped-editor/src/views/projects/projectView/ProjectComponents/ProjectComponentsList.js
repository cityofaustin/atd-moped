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
  onEditFeatures,
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

  const onEditMap = (component) => {
    editDispatch({ type: "start_map_edit", payload: component });
    onEditFeatures();
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
                    onClick={onEditAttributes}
                  >
                    Attributes
                  </Button>
                }
              />
              {!isSignalComponent(component) && (
                <ListItemText
                  primary={
                    <Button
                      fullWidth
                      size="small"
                      color="primary"
                      startIcon={<TimelineIcon />}
                      onClick={() => onEditMap(component)}
                    >
                      Map
                    </Button>
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
