import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import TuneIcon from "@material-ui/icons/Tune";
import ComponentListItem from "./ComponentListItem";
import DraftComponentListItem from "./DraftComponentListItem";
import RelatedComponentListItem from "./RelatedComponentListItem";

const useStyles = makeStyles(() => ({
  buttonTextLeft: {
    justifyContent: "flex-start",
  },
}));

const ComponentList = ({
  createState,
  editState,
  editDispatch,
  shouldShowRelatedProjects,
  setShouldShowRelatedProjects,
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
}) => {
  const classes = useStyles();

  return (
    <List>
      {!createState.isCreatingComponent && !editState.isEditingComponent && (
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
            <ListItem>
              <FormControlLabel
                control={
                  <Switch
                    checked={shouldShowRelatedProjects}
                    onChange={() =>
                      setShouldShowRelatedProjects(!shouldShowRelatedProjects)
                    }
                    name="showRelatedProjects"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="subtitle2">
                    Show related projects
                  </Typography>
                }
                labelPlacement="start"
              />
            </ListItem>
          </Collapse>
          <Divider />
        </>
      )}
      {createState.draftComponent && createState.isCreatingComponent && (
        <DraftComponentListItem
          primaryText={createState.draftComponent.component_name}
          secondaryText={createState.draftComponent.component_subtype}
          onSave={onSaveDraftComponent}
          onCancel={onCancelComponentCreate}
          saveButtonDisabled={!createState.draftComponent?.features.length > 0}
          saveButtonText="Save"
        />
      )}
      {editState.draftEditComponent && editState.isEditingComponent && (
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
      {!editState.isEditingComponent &&
        !createState.isCreatingComponent &&
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
      {/* TODO: Create parent list items component */}
      {!editState.isEditingComponent &&
        !createState.isCreatingComponent &&
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
            />
          );
        })}
    </List>
  );
};

export default ComponentList;
