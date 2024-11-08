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
import { Grid, Chip } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { COLORS } from "./mapStyleSettings";
import ProjectStatusBadge from "../ProjectStatusBadge";
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
    flexGrow: 1,
    marginRight: theme.spacing(6),
  },
  additionalListItemText: {
    display: "block",
  },
  workTypeChip: {
    height: "auto",
    "& .MuiChip-label": {
      display: "block",
      whiteSpace: "normal",
    },
  },
  workTypeGroup: {
    paddingLeft: theme.spacing(4),
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
        onClick={onListItemClick}
        className={classes.listItem}
        ref={component._ref}
      >
        {isComponentMapped ? Icon : <ErrorOutlineIcon color="error" />}
        <Box>
          <Box display="flex" alignItems="center" width="100%">
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
              <IconButton color="primary" onClick={onZoomClick} size="large">
                <ZoomInIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </Box>
          {!!component.moped_phase && (
            <Box width="100%" sx={{ my: 0.5, ml: 1 }}>
              <ProjectStatusBadge
                phaseName={component.moped_phase?.phase_name}
                phaseKey={component.moped_phase?.phase_key}
                condensed
              />
            </Box>
          )}
        </Box>
      </ListItemButton>
      <Collapse in={isExpanded}>
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
            <Grid container spacing={0.5} className={classes.workTypeGroup}>
              {component.moped_proj_component_work_types.map((element) => (
                <Grid item key={element.id}>
                  <Chip
                    label={element.moped_work_type.name}
                    className={classes.workTypeChip}
                  />
                </Grid>
              ))}
            </Grid>
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
