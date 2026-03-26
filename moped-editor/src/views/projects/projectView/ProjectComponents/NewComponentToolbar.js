import DocumentationIconLink from "src/components/DocumentationIconLink";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Collapse from "@mui/material/Collapse";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TuneIcon from "@mui/icons-material/Tune";

const NewComponentToolbar = ({
  createState,
  editState,
  shouldShowRelatedProjects,
  toggleShowRelatedProjects,
  onStartCreatingComponent,
  areSettingsOpen,
  setAreSettingsOpen,
}) => {
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  return (
    isNotCreatingOrEditing && (
      <>
        <ListItem dense sx={{ justifyContent: "space-between" }}>
          <Button
            sx={{ justifyContent: "flex-start" }}
            size="small"
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={onStartCreatingComponent}
          >
            New Component
          </Button>
          <Box sx={{ display: "flex" }}>
            <IconButton
              onClick={() => setAreSettingsOpen(!areSettingsOpen)}
              aria-label="settings"
              size="large"
            >
              <TuneIcon fontSize="small" />
            </IconButton>
            <DocumentationIconLink
              documentationLink="https://atd-dts.gitbook.io/moped-documentation/user-guides/project-map"
              size="large"
            />
          </Box>
        </ListItem>
        <Collapse in={areSettingsOpen}>
          <Box
            sx={{
              borderLeft: 7,
              borderColor: "white",
            }}
          >
            <ListItem
              sx={(theme) => ({
                paddingLeft: theme.spacing(1),
                paddingTop: 0,
              })}
            >
              <Icon />
              <ListItemText
                sx={(theme) => ({
                  marginLeft: theme.spacing(1),
                })}
                secondary="Show related projects"
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={shouldShowRelatedProjects}
                  onChange={toggleShowRelatedProjects}
                  name="showRelatedProjects"
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </Box>
        </Collapse>
        <Divider />
      </>
    )
  );
};

export default NewComponentToolbar;
