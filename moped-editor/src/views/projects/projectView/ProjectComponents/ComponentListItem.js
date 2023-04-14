import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import IconButton from "@material-ui/core/IconButton";
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
  additionalListItemText: {
    display: "block",
  },
}));

export default function ComponentListItem({
  component,
  isExpanded,
  onZoomClick,
  onListItemClick,
  Icon,
  selectedBorderColor,
  additionalListItemText,
  additionalCollapseListItems,
}) {
  const classes = useStyles();

  const { primary, secondary } = useComponentListItemText(component);

  return (
    <Box
      borderLeft={7}
      style={{
        borderColor: isExpanded ? selectedBorderColor : COLORS.white,
      }}
    >
      <ListItem
        dense
        button
        onClick={onListItemClick}
        className={classes.listItem}
        ref={component._ref}
      >
        {Icon}
        <ListItemText
          className={classes.listItemText}
          primary={primary}
          secondary={
            <>
              <>{secondary}</>
              <span className={classes.additionalListItemText}>
                {additionalListItemText}
              </span>
            </>
          }
        />
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
          {additionalCollapseListItems}
        </List>
      </Collapse>
      <Divider />
    </Box>
  );
}
