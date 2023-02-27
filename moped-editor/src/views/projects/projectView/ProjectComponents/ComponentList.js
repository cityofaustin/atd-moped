import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
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
import ComponentListItem from "./ComponentListItem";
import DraftComponentListItem from "./DraftComponentListItem";
import RelatedComponentListItem from "./RelatedComponentListItem";

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

const ComponentList = ({
  createState,
  editState,
  editDispatch,
  shouldShowRelatedProjects,
  toggleShowRelatedProjects,
  onStartCreatingComponent,
  areSettingsOpen,
  setAreSettingsOpen,
  clickedComponent,
  setClickedComponent,
  onCancelComponentCreate,
  onCancelComponentMapEdit,
  onClickZoomToComponent,
  allRelatedComponents,
  projectComponents,
  setIsDeletingComponent,
  doesDraftEditComponentHaveFeatures,
  onSaveDraftComponent,
  onSaveEditedComponent,
  setIsClickedComponentRelated,
}) => {
  const classes = useStyles();
  const isNotCreatingOrEditing =
    !createState.isCreatingComponent && !editState.isEditingComponent;
  const shouldShowCreateListItem =
    createState.draftComponent && createState.isCreatingComponent;
  const shouldShowEditListItem =
    editState.draftEditComponent && editState.isEditingComponent;

  return (
    <List>
      {isNotCreatingOrEditing && (
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
      )}
      {shouldShowCreateListItem && (
        <DraftComponentListItem
          primaryText={createState.draftComponent.component_name}
          secondaryText={createState.draftComponent.component_subtype}
          onSave={onSaveDraftComponent}
          onCancel={onCancelComponentCreate}
          saveButtonDisabled={!createState.draftComponent?.features.length > 0}
          saveButtonText="Save"
        />
      )}
      {shouldShowEditListItem && (
        <DraftComponentListItem
          primaryText={
            editState.draftEditComponent?.moped_components?.component_name
          }
          secondaryText={
            editState.draftEditComponent?.moped_components?.component_subtype
          }
          onSave={onSaveEditedComponent}
          onCancel={onCancelComponentMapEdit}
          saveButtonDisabled={!doesDraftEditComponentHaveFeatures}
          saveButtonText="Save Edit"
        />
      )}
      {isNotCreatingOrEditing &&
        projectComponents.map((component) => {
          const isExpanded =
            clickedComponent?.project_component_id ===
            component.project_component_id;
          return (
            <ComponentListItem
              key={component.project_component_id}
              component={component}
              isExpanded={isExpanded}
              setClickedComponent={setClickedComponent}
              setIsDeletingComponent={setIsDeletingComponent}
              editDispatch={editDispatch}
              onClickZoomToComponent={onClickZoomToComponent}
              isEditingComponent={editState.isEditingComponent}
              isCreatingComponent={createState.isCreatingComponent}
            />
          );
        })}
      {isNotCreatingOrEditing &&
        shouldShowRelatedProjects &&
        allRelatedComponents.map((component) => {
          const isExpanded =
            clickedComponent?.project_component_id ===
            component.project_component_id;
          return (
            <RelatedComponentListItem
              key={component.project_component_id}
              component={component}
              isExpanded={isExpanded}
              setClickedComponent={setClickedComponent}
              setIsDeletingComponent={setIsDeletingComponent}
              editDispatch={editDispatch}
              onClickZoomToComponent={onClickZoomToComponent}
              isEditingComponent={editState.isEditingComponent}
              isCreatingComponent={createState.isCreatingComponent}
              setIsClickedComponentRelated={setIsClickedComponentRelated}
            />
          );
        })}
    </List>
  );
};

export default ComponentList;
