import ComponentListItem from "./ComponentListItem";
import Button from "@material-ui/core/Button";
import { EditOutlined } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { isSignalComponent } from "./utils/componentList";

const ProjectComponentsList = ({
  createState,
  editState,
  editDispatch,
  clickedComponent,
  setClickedComponent,
  onClickZoomToComponent,
  projectComponents,
  setIsDeletingComponent,
}) => {
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  const isExpanded = (component) =>
    clickedComponent?.project_component_id === component.project_component_id;

  const onListItemClick = (component) => {
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

  return (
    isNotCreatingOrEditing &&
    projectComponents.map((component) => {
      return (
        <ComponentListItem
          key={component.project_component_id}
          component={component}
          isExpanded={isExpanded(component)}
          onZoomClick={() => onClickZoomToComponent(component)}
          onListItemClick={() => onListItemClick(component)}
          additionalCollapseListItems={
            <ListItem dense disableGutters>
              <ListItemText
                primary={
                  <Button
                    fullWidth
                    size="small"
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
                    startIcon={<EditOutlined />}
                    onClick={() => onStartEditingComponent(component)}
                  >
                    Edit
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
