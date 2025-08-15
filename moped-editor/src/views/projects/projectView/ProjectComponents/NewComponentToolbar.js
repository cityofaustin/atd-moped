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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
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
        <ListItem dense>
          <Button
            sx={{ justifyContent: "flex-start" }}
            size="small"
            color="primary"
            fullWidth
            startIcon={<AddCircleOutlineIcon />}
            onClick={onStartCreatingComponent}
          >
            New Component
          </Button>
          <IconButton
            onClick={() => setAreSettingsOpen(!areSettingsOpen)}
            aria-label="settings"
            size="large"
          >
            <TuneIcon fontSize="small" />
          </IconButton>
        </ListItem>
        <Collapse in={areSettingsOpen}>
          <Box borderLeft={7} borderColor="white">
            <ListItem
              sx={{
                paddingLeft: (theme) => theme.spacing(1),
                paddingTop: 0,
              }}
            >
              <Icon />
              <ListItemText
                sx={{ marginLeft: (theme) => theme.spacing(1) }}
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
