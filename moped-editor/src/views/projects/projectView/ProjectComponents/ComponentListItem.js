import { makeStyles, useMemo } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { EditOutlined } from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText";
import { COLORS } from "./mapStyleSettings";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const isSignalComponent = (component) =>
  component?.moped_components?.feature_layer?.internal_table ===
  "feature_signals";

/**
 * Format the list item's primary and secondary text
 * @param {object} component - the moped_component object
 * @returns {object} the component props for <ListItemText> as { primary, secondary }
 */
const useComponentListItemText = (component) =>
  useMemo(() => {
    const listItemText = { primary: undefined, secondary: undefined };
    const componentName = component?.moped_components?.component_name;
    const componentSubtype = component?.moped_components?.component_subtype;
    const signalLocationName = component?.feature_signals?.[0]?.location_name;
    const signalId = component?.feature_signals?.[0]?.signal_id;
    listItemText.primary = componentSubtype
      ? `${componentName} - ${componentSubtype}`
      : componentName;
    listItemText.secondary = isSignalComponent(component)
      ? `${signalId}: ${signalLocationName}`
      : "";
    return listItemText;
  }, [component]);

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

  const onStartEditingComponent = () => {
    if (isSignalComponent(component)) {
      editDispatch({ type: "start_attributes_edit" });
    } else {
      editDispatch({ type: "start_edit", payload: component });
    }
  };

  const listItemText = useComponentListItemText(component);

  return (
    <Box
      borderLeft={7}
      style={{
        borderColor: isExpanded ? COLORS.bluePrimary : COLORS.white,
      }}
    >
      <ListItem dense button onClick={onListItemClick}>
        <ListItemText {...listItemText} />
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
