import makeStyles from "@mui/styles/makeStyles";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import IconButton from "@mui/material/IconButton";
import ListItemText from "@mui/material/ListItemText";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { COLORS } from "./mapStyleSettings";
import {
  useComponentListItemText,
  getIsComponentMapped,
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
  style,
}) {
  const classes = useStyles();

  const { primary, secondary } = useComponentListItemText(component);
  const isComponentMapped = getIsComponentMapped(component);

  return (
    <Box
      borderLeft={7}
      style={{
        borderColor: isExpanded ? selectedBorderColor : COLORS.white,
      }}
    >
      <ListItemButton
        dense
        onClick={() => onListItemClick(component)}
        className={classes.listItem}
        ref={component._ref}
        style={style}
      >
        {isComponentMapped ? Icon : <ErrorOutlineIcon color="error" />}
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
          <IconButton
            color="primary"
            onClick={() => onZoomClick(component)}
            size="large"
          >
            <ZoomInIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItemButton>
      <Collapse in={isExpanded} unmountOnExit>
        {isExpanded ? (
          <List component="div" disablePadding dense>
            {!isComponentMapped && (
              <ListItem dense className={classes.listItem}>
                <ListItemText
                  primary={
                    <Alert severity="error">Component is not mapped</Alert>
                  }
                />
              </ListItem>
            )}
            {component.description && (
              <ListItem className={classes.nested}>
                <ListItemText secondary={component.description} />
              </ListItem>
            )}
            {additionalCollapseListItems}
          </List>
        ) : null}
      </Collapse>
      <Divider />
    </Box>
  );
}
