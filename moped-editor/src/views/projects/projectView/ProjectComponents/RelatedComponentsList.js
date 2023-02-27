import ComponentListItem from "./ComponentListItem";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Link from "@material-ui/core/Link";
import { useStyles } from "./ComponentListItem";

const RelatedComponentsList = ({
  createState,
  editState,
  shouldShowRelatedProjects,
  clickedComponent,
  setClickedComponent,
  onClickZoomToComponent,
  allRelatedComponents,
  setIsClickedComponentRelated,
}) => {
  const classes = useStyles();

  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  const onListItemClick = (component) => {
    setClickedComponent(component);
    setIsClickedComponentRelated(true);
  };

  const onZoomClick = (component) => {
    onClickZoomToComponent(component);
    setIsClickedComponentRelated(true);
  };

  return (
    isNotCreatingOrEditing &&
    shouldShowRelatedProjects &&
    allRelatedComponents.map((component) => {
      const isExpanded =
        clickedComponent?.project_component_id ===
        component.project_component_id;
      return (
        <ComponentListItem
          key={component.project_component_id}
          component={component}
          isExpanded={isExpanded}
          onZoomClick={() => onZoomClick(component)}
          onListItemClick={() => onListItemClick(component)}
          additionalListItemText={
            <ListItemText
              secondary={
                <>
                  Part of project{" "}
                  <Link
                    href={`/moped/projects/${component.project_id}?tab=map`}
                    target="blank"
                  >{`#${component.project_id}`}</Link>
                </>
              }
              className={classes.listItemText}
            />
          }
        />
      );
    })
  );
};

export default RelatedComponentsList;
