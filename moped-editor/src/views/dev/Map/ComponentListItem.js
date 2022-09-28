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
  onStartEditingComponent,
  onClickZoomToComponent,
}) {
  const classes = useStyles();

  return (
    <Box
      borderLeft={7}
      style={{
        borderColor: isExpanded ? "#1276D1" : "#fff",
        // backgroundColor: isExpanded ? "#e8f3fd" : "#fff",
      }}
    >
      <ListItem
        dense
        button
        onClick={() => {
          if (isExpanded) {
            setClickedComponent(null);
          } else {
            setClickedComponent(component);
          }
        }}
      >
        <ListItemText
          primary={component.component_name}
          secondary={component.component_subtype}
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
          <ListItem dense>
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
            <ListItemText
              primary={
                <Button
                  fullWidth
                  size="small"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => setIsDeletingComponent(true)}
                >
                  Delete
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
