import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Icon from "@material-ui/core/Icon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import TuneIcon from "@material-ui/icons/Tune";

const useStyles = makeStyles((theme) => ({
  buttonTextLeft: {
    justifyContent: "flex-start",
  },
  listItem: {
    paddingLeft: theme.spacing(1),
    paddingTop: 0,
  },
  listItemText: {
    marginLeft: theme.spacing(1),
  },
}));

const NewComponentToolbar = ({
  createState,
  editState,
  shouldShowRelatedProjects,
  toggleShowRelatedProjects,
  onStartCreatingComponent,
  areSettingsOpen,
  setAreSettingsOpen,
}) => {
  const classes = useStyles();
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;

  return (
    isNotCreatingOrEditing && (
      <>
        <ListItem dense>
          <Button
            className={classes.buttonTextLeft}
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
          >
            <TuneIcon fontSize="small" />
          </IconButton>
        </ListItem>
        <Collapse in={areSettingsOpen}>
          <Box borderLeft={7} borderColor="white">
            <ListItem className={classes.listItem}>
              <Icon />
              <ListItemText
                className={classes.listItemText}
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
