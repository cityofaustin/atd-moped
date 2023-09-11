import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import { COLORS } from "./mapStyleSettings";
import {
  useComponentListItemText,
  isSignalComponent,
} from "./utils/componentList";

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
  truncatedText: {
    textOverflow: "ellipsis",
    textWrap: "nowrap",
    overflow: "hidden",
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
  const signalComponent = isSignalComponent(component);

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
              <span className={!isExpanded && classes.truncatedText}>
                {secondary}
              </span>
              <span className={classes.additionalListItemText}>
                {additionalListItemText}
              </span>
            </>
          }
        />
        <ListItemSecondaryAction>
          <IconButton color="primary" onClick={onZoomClick} size="large">
            <ZoomInIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse in={isExpanded}>
        <List component="div" disablePadding dense>
          {signalComponent && component.description && (
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
