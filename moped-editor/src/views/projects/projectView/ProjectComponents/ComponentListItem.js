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
import Button from "@material-ui/core/Button";
import { EditOutlined } from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText";
import { COLORS } from "./mapStyleSettings";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function ComponentListItem({
  component,
  isExpanded,
  setClickedComponent,
  setIsDeletingComponent,
  editDispatch,
  onClickZoomToComponent,
  isEditingComponent,
  isCreatingComponent,
  hideEditButton = false,
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

  const onStartEditingComponent = () =>
    editDispatch({ type: "start_edit", payload: component });

  console.log(component);
  const isSignalComponent = Boolean(
    component?.moped_components?.component_name === "Signal"
  );
  const componentName = component?.moped_components?.component_name;
  const signalLocationName = component?.feature_signals?.[0]?.location_name;
  const listItemPrimaryText = isSignalComponent
    ? `${componentName} -${signalLocationName}`
    : componentName;

  return (
    <Box
      borderLeft={7}
      style={{
        borderColor: isExpanded ? COLORS.bluePrimary : COLORS.white,
      }}
    >
      <ListItem dense button onClick={onListItemClick}>
        <ListItemText
          primary={listItemPrimaryText}
          secondary={component.moped_components?.component_subtype}
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
                !hideEditButton && (
                  <Button
                    fullWidth
                    size="small"
                    color="primary"
                    startIcon={<EditOutlined />}
                    onClick={onStartEditingComponent}
                  >
                    Edit
                  </Button>
                )
              }
            />
          </ListItem>
        </List>
      </Collapse>
      <Divider />
    </Box>
  );
}
