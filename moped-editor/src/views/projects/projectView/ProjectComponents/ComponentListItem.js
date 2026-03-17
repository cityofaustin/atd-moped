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
import { Grid2, Chip } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { COLORS } from "./mapStyleSettings";
import ProjectStatusBadge from "../ProjectStatusBadge";
import {
  useComponentListItemText,
  getIsComponentMapped,
} from "./utils/componentList";

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
  const { primary, secondary } = useComponentListItemText(component);
  const isComponentMapped = getIsComponentMapped(component);

  return (
    <Box
      style={{
        borderColor: isExpanded ? selectedBorderColor : COLORS.white,
      }}
      sx={{
        borderLeft: 7
      }}
    >
      <ListItemButton
        dense
        onClick={onListItemClick}
        sx={theme => ({
          paddingLeft: theme.spacing(1)
        })}
        ref={component._ref}
      >
        {isComponentMapped ? Icon : <ErrorOutlineIcon color="error" />}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%"
            }}>
            <ListItemText
              sx={theme => ({
                marginLeft: theme.spacing(1),
                flexGrow: 1,
                marginRight: theme.spacing(6)
              })}
              primary={primary}
              secondary={
                <>
                  <>{secondary}</>
                  <Box
                    sx={{
                      display: "block",
                    }}
                  >
                    {additionalListItemText}
                  </Box>
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
            <Box
              sx={{
                width: "100%",
                my: 0.5,
                ml: 1
              }}>
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
              <ListItem dense sx={theme => ({
                paddingLeft: theme.spacing(1)
              })}>
                <ListItemText
                  primary={
                    <Alert severity="error">Component is not mapped</Alert>
                  }
                />
              </ListItem>
            )}
            {component.moped_proj_component_work_types.length > 0 && (
              <ListItem sx={theme => ({
                paddingLeft: theme.spacing(4)
              })}>
                <Grid2 container spacing={0.5}>
                  {component.moped_proj_component_work_types.map((element) => (
                    <Grid2 key={element.moped_work_type.id}>
                      <Chip
                        label={element.moped_work_type.name}
                        sx={{
                          "& .MuiChip-label": {
                            display: "block",
                            whiteSpace: "normal",
                          },
                          fontWeight: "500",
                          fontSize: "12px",
                          borderRadius: "2rem",
                          height: "1.75rem",
                        }}
                      />
                    </Grid2>
                  ))}
                </Grid2>
              </ListItem>
            )}
            {component.description && (
              <ListItem sx={theme => ({
                paddingLeft: theme.spacing(4)
              })}>
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