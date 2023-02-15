import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import PlaceOutlinedIcon from "@material-ui/icons/PlaceOutlined";
import Button from "@material-ui/core/Button";
import { EditOutlined } from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText";
import { COLORS } from "./mapStyleSettings";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  listItem: {
    paddingLeft: theme.spacing(1),
  },
  listItemText: {
    marginLeft: theme.spacing(1),
  },
}));

// TODO: Create a ListItem that can be shared between
// DraftComponentListItemm, ComponentListItem, and the controls
// TODO: Create new SourcesAndLayers component for shared components
// TODO: Create a component for the controls that use the shared ListItem
// but also has spaces for the related projects control and future ones
// TODO: Show parent and children components in the list
// TODO: Related components show by default
// TODO: If it is related, show "Part of project #123 (project # is a link)"
// TODO: Parent and sibling components are not editable
// ?: Should we have a button to refresh the data? It could get stale if going
// to another project, editing that component, and then going back to the other tab
// TODO: Another useMemo to create data structure of parent and children components

export default function ComponentListItem({
  component,
  isExpanded,
  setClickedComponent,
  setIsDeletingComponent,
  editDispatch,
  onClickZoomToComponent,
  isEditingComponent,
  isCreatingComponent,
}) {
  const classes = useStyles();

  const onListItemClick = () => {
    // If we are editing a component, clicking on a component should not change the clicked component
    if (isExpanded) {
      setClickedComponent(null);
    } else if (!isEditingComponent && !isCreatingComponent) {
      setClickedComponent(component);
    }
  };

  const isSignalComponent =
    component?.moped_components?.feature_layer?.internal_table ===
    "feature_signals";
  const componentName = component?.moped_components?.component_name;
  const signalLocationName = component?.feature_signals?.[0]?.location_name;
  const listItemPrimaryText = isSignalComponent
    ? `${componentName} -${signalLocationName}`
    : componentName;

  const onStartEditingComponent = () => {
    if (isSignalComponent) {
      editDispatch({ type: "start_attributes_edit" });
    } else {
      editDispatch({ type: "start_edit", payload: component });
    }
  };

  return (
    <Box
      borderLeft={7}
      style={{
        borderColor: isExpanded ? COLORS.bluePrimary : COLORS.white,
      }}
    >
      <ListItem
        dense
        button
        onClick={onListItemClick}
        className={classes.listItem}
      >
        <PlaceOutlinedIcon color="primary" />
        <ListItemText
          primary={listItemPrimaryText}
          secondary={component.moped_components?.component_subtype}
          className={classes.listItemText}
        />
        <ListItemSecondaryAction>
          <IconButton
            color="primary"
            onClick={() => onClickZoomToComponent(component)}
          >
            <ZoomInIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={isExpanded}>
        <List component="div" disablePadding dense>
          {component.description && (
            <ListItem className={classes.nested}>
              <ListItemText secondary={component.description} />
            </ListItem>
          )}
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
                  onClick={onStartEditingComponent}
                >
                  Edit
                </Button>
              }
            />
          </ListItem>
        </List>
      </Collapse>
      <Divider />
    </Box>
  );
}
