import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import IconButton from "@material-ui/core/IconButton";
import PlaceOutlinedIcon from "@material-ui/icons/PlaceOutlined";
import ListItemText from "@material-ui/core/ListItemText";
import { COLORS } from "./mapStyleSettings";
import { useComponentListItemText } from "./utils/componentList";

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

export default function ComponentListItem({
  component,
  isExpanded,
  onZoomClick,
  onListItemClick,
  additionalListItems,
}) {
  const classes = useStyles();

  const listItemText = useComponentListItemText(component);

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
        <ListItemText className={classes.listItemText} {...listItemText} />
        <ListItemSecondaryAction>
          <IconButton color="primary" onClick={onZoomClick}>
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
          {additionalListItems}
        </List>
      </Collapse>
      <Divider />
    </Box>
  );
}
