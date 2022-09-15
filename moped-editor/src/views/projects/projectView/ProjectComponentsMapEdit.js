import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Icon,
  TextField,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  UPDATE_MOPED_COMPONENT,
  DELETE_MOPED_COMPONENT,
} from "../../../queries/project";
import ProjectComponentSubcomponents from "./ProjectComponentSubcomponents";
import SignalComponentAutocomplete from "./SignalComponentAutocomplete";
import ProjectComponentsMap from "./ProjectComponentsMap";
import MapToolsCollapse from "src/components/Maps/MapToolsCollapse";
import { Alert, Autocomplete } from "@material-ui/lab";
import {
  countFeatures,
  mapConfig,
  useSaveActionReducer,
} from "../../../utils/mapHelpers";
import { useInitialTypeCounts } from "src/utils/projectComponentHelpers";
import { filterObjectByKeys } from "../../../utils/materialTableHelpers";
import { useParams } from "react-router-dom";
import { KeyboardArrowUp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  title: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  selectEmpty: {
    marginTop: theme.spacing(1),
  },
  formSelect: {
    width: "100%",
  },
  formButton: {
    margin: theme.spacing(1),
  },
  formTextField: {
    width: "97%",
    margin: "4px",
  },
  mapAlert: {
    margin: theme.spacing(1),
  },
  mapStyle: {
    position: "relative",
    padding: 0,
  },
  mapToolsDivider: {
    marginTop: ".5rem",
  },
  layerSelectBox: {
    maxHeight: "35vh",
    overflow: "scroll",
    // Chrome
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none" /* IE and Edge */,
    "scrollbar-width": "none" /* Firefox */,
  },
}));

const EMPTY_FEATURE_COLLECTION = {
  type: "FeatureCollection",
  features: [],
};

/**
 * The project component editor
 * @param {Object} selectedProjectComponent - the selected moped_proj_component chosen in dropdown
 * @param {Object[]} mopedComponents - the moped_components lookup table
 * @param {Object[]} mopedSubcomponents - the moped_subcomponents lookup table
 * @param {function} handleCancelEdit - The function to call if we need to cancel editing
 * @param {Object} projectFeatureCollection - The entire project's feature collection GeoJSON
 * @param {Object} selectedComponentFeatureCollection - The selected component's feature collection GeoJSON
 * @param {Object[]} availableTypes - a unique sorted list containing the names of available components
 * @param {Object[]} lineRepresentable - a list of components that are represented by lines
 *
 * @return {JSX.Element}
 * @constructor
 */
const ProjectComponentsMapEdit = ({
  projectFeatureCollection,
  selectedProjectComponent,
  selectedComponentFeatureCollection,
  mopedComponents,
  mopedSubcomponents,
  handleCancelEdit,
  availableTypes,
  lineRepresentable,
}) => {
  const { projectId } = useParams();
  const classes = useStyles();
  /**
   * The State
   * @type {Number} selectedComponentId - id of component chosen in dropdown
   * @type {String} selectedComponentType - A string containing the name of the selected type in lowercase
   * @type {String} selectedComponentSubtype - A string containing the name of the selected subtype in lowercase
   * @type {String[]} selectedComponentSubtype - A string list containing all available subtypes for type
   * @type {Number[]} selectedSubcomponents - A number array containing the id of the selected subcomponents
   * @type {String[]} availableSubtypes - An string list containing all available subtypes for the selected component
   * @type {Object[]} editFeatureComponents - An object list containing the features for this component
   * @type {Object} editFeatureCollection - The final GeoJson generated for all the the features in this component
   * @type {String} componentDescription - The description of this component
   * @type {boolean} deleteDialogOpen - If true, it displays the delete dialog, or hides it if false.
   * @type {boolean} editPanelCollapsed - If true, component picking panel is collapsed
   * @type {boolean} editPanelCollapsedShow - If true, component picking panel is showing
   * @constant
   */
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [selectedComponentType, setSelectedComponentType] = useState(null);
  const [selectedComponentSubtype, setSelectedComponentSubtype] =
    useState(null);
  const [selectedSubcomponents, setSelectedSubcomponents] = useState([]);
  const [availableSubtypes, setAvailableSubtypes] = useState([]);
  const [editFeatureCollection, setEditFeatureCollection] = useState(null);
  const [drawLines, setDrawLines] = useState(null);

  const [componentDescription, setComponentDescription] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editPanelCollapsed, setEditPanelCollapsed] = useState(true);
  const [editPanelCollapsedShow, setEditPanelCollapsedShow] = useState(false);

  const projComponentId = selectedProjectComponent?.project_component_id;

  const [updateProjectComponents] = useMutation(UPDATE_MOPED_COMPONENT);

  const [deleteProjectComponent] = useMutation(DELETE_MOPED_COMPONENT);

  /**
   * saveActionState contains the current save state
   * saveActionDispatch allows us to update the state via action (signal) dispatch.
   */
  const { saveActionState, saveActionDispatch } = useSaveActionReducer();

  const initialTypeCounts = useInitialTypeCounts(
    mopedComponents,
    mopedSubcomponents
  );

  // Now check if we have any subcomponents in the DB
  const subcomponentsDB =
    /**
     * Get moped_proj_components or assume empty array, if the array is empty it means
     * the user has not selected a component; which should never be the case. Do we have
     * a selected component? (is the count greater than zero?)
     */
    selectedProjectComponent
      ? // Yes, we have project a component, now gather a list of subcomponents for that component
        selectedProjectComponent.moped_proj_components_subcomponents.map(
          (subcomponent) => ({
            ...subcomponent.moped_subcomponent,
            component_subcomponent_id: subcomponent.component_subcomponent_id,
          })
        )
      : // Nothing to do here, no valid component is selected.
        [];

  /**
   * Generates a list of available subtypes for a given type name
   * @param {String} type - The type name
   * @return {String[]} - A string array with the available subtypes
   */
  const getAvailableSubtypes = (type) =>
    // For every subtype found in initialTypeCounts[type]
    Object.entries(initialTypeCounts[type]?.subtypes ?? {})
      // Destructure the key and value (_ & component, respectively) and gather the name
      .map(([_, component]) => (component?.component_subtype ?? "").trim())
      .filter((item) => item.length > 0); // Keep only if the name is not empty

  /**
   * Returns any available subcomponent objects for a specific type
   * @param {String} type - Lower case of the name of the type
   * @return {Object[]}
   */
  const getAvailableSubcomponents = () =>
    initialTypeCounts[selectedComponentType].subcomponents;

  /**
   * Handles the delete button click
   */
  const handleDeleteDialogClickOpen = () => {
    setDeleteDialogOpen(true);
  };

  /**
   * Handles the closing of the dialog
   */
  const handleDeleteDialogClickClose = () => {
    setDeleteDialogOpen(false);
  };

  /**
   * On select, it changes the available items for that specific type
   * @param {Object} e - The Object Type
   * @param {String} newValue - The new value from the autocomplete selector
   */
  const handleComponentTypeSelect = (e, newValue) => {
    const selectedType = (newValue ?? e.target.value ?? "").toLowerCase();
    // Generates a list of available component subtypes given a component type
    const newAvailableSubTypes = getAvailableSubtypes(selectedType);

    // Set The selected component type
    setSelectedComponentType(selectedType);
    setAvailableSubtypes(newAvailableSubTypes);
    setSelectedComponentSubtype(null);
    // check if the selected type is in the array of lineRepresentable types, set drawLines as true or false
    const componentName = selectedType.toLowerCase().replaceAll(" ", "");
    setDrawLines(lineRepresentable[componentName]);
  };

  /**
   * On select, it changes the value of selectedSubtype state
   * @param {Object} e - The event object
   * @param {String} newValue - The new value from the autocomplete selector
   */
  const handleComponentSubtypeSelect = (e, newValue) => {
    const componentName =
      selectedComponentType.toLowerCase().replaceAll(" ", "") +
      newValue.toLowerCase().replaceAll(" ", "");
    setDrawLines(lineRepresentable[componentName]);
    setSelectedComponentSubtype((newValue ?? "").toLowerCase());
  };

  /**
   * Retrieves the component_id based on the type and subtype names
   * @param {string} type - The type name
   * @param {string} subtype - The subtype name
   */
  const getSelectedComponentId = (type, subtype) =>
    initialTypeCounts[type].count > 1 // Is it a group?
      ? // Yes, we need to look for the subtype's component_id
        initialTypeCounts[type].subtypes[subtype ?? ""]?.component_id ?? null
      : // No, then it's safe to get the component_id from the parent
        initialTypeCounts[type]?.component_id ?? null;

  /**
   * Returns true if the given type needs a subtype
   * @param {string} type
   * @return {boolean}
   */
  const isSubtypeOptional = (type) =>
    (initialTypeCounts[type]?.count ?? 0) === 1 ||
    Object.keys(initialTypeCounts[type]?.subtypes ?? {}).includes("");

  /**
   * Calls upsert project features mutation, refetches data, and handles dialog close on success
   */
  const generateFeatureUpserts = () => {
    // generate a list of moped_proj_features to be upserted
    const projectFeaturesToCreateOrUpdate = editFeatureCollection.features.map(
      (feature) => {
        let projectFeature = {};
        if (feature.feature_id) {
          projectFeature.feature_id = feature.feature_id;
        }
        projectFeature.feature = { ...feature };
        return projectFeature;
      }
    );

    // identify IDs of existing project features
    const projectFeatureIds = projectFeaturesToCreateOrUpdate
      .map((projectFeature) => projectFeature.feature_id)
      .filter((featureId) => featureId);

    let projectFeaturesToDelete = [];

    // identify any features in original component features (before editing) that need
    // to be deleted
    if (selectedProjectComponent) {
      selectedProjectComponent.moped_proj_features
        .filter((projectFeature) => {
          const featureId = projectFeature.feature_id;
          return projectFeatureIds.indexOf(featureId) < 0;
        })
        .forEach((projectFeature) => {
          // create a mutable copy of the feature
          let featureToDelete = { ...projectFeature };
          // set status to deleted
          featureToDelete.is_deleted = true;
          // remove __typename (a graphql artifact)
          delete featureToDelete.__typename;
          // add to delete array
          projectFeaturesToDelete.push(featureToDelete);
        });
    }
    return [...projectFeaturesToCreateOrUpdate, ...projectFeaturesToDelete];
  };

  /**
   * Generates a list of subcomponents to be upserted in Hasura
   * @return {Object[]}
   */
  const generateSubcomponentUpserts = () => {
    // If there are no subcomponents, then remove them all if present.
    const removeAllSubcomponents = getAvailableSubcomponents().length === 0;

    // Generate a list of subcomponents to be removed
    const removalList = subcomponentsDB
      .filter(
        // Check every old subcomponent
        (oldSubcomponent) =>
          // If not found, mark it as true so it's part of the selectedSubcomponents list
          removeAllSubcomponents ||
          !selectedSubcomponents.find(
            (newSubcomponent) =>
              // Return true if we have found the old subcomponent in this list
              oldSubcomponent.subcomponent_id ===
              newSubcomponent.subcomponent_id
          )
      )
      // Mark remove list for deletion
      .map((subcomponent) => ({ ...subcomponent, is_deleted: true }));

    // Remove existing subcomponents, keep only those that need inserting
    const insertionList = selectedSubcomponents.filter(
      // If the subcomponent does not have component_subcomponent_id, then keep
      // Otherwise, it means it already exists in the database
      (subcomponent) => isNaN(subcomponent?.component_subcomponent_id)
    );

    // Generate output, clean up & return
    return (
      [...insertionList, ...removalList] // Mix both insertion and removal list
        // Then remove certain objects by their key names from the output
        .map((record) =>
          filterObjectByKeys(record, [
            "__typename",
            "component_id",
            "subcomponent_name",
          ])
        )
    );
  };

  /**
   * Handles the key down events for the description field
   * @param {Object} e - The event object
   */
  const handleDescriptionKeyDown = (e) => {
    setComponentDescription(e.target.value);
  };

  /**
   * Handles the exit of the current edit screen and reloads
   */
  const exitAndReload = () => {
    handleCancelEdit();
  };

  /**
   * Persists the changes to the database
   */
  const handleSaveButtonClick = () => {
    // First, we need a list of map changes only
    const projectFeatures = generateFeatureUpserts();

    // 2. Generate a list of subcomponent upserts
    const subcomponentChanges = generateSubcomponentUpserts();

    /**
     * This document represents all the variables Hasura needs
     * to create a moped_proj_component in Hasura. It uses Hasura's
     * nested insertion to establish relationships when creating
     * new objects, and it uses primary keys when upserting.
     * @type {moped_proj_component}
     */
    const variablePayload = {
      /*
        First we need a component's common fields: name, status, etc.
      */
      name: "",
      project_id: Number.parseInt(projectId),
      component_id: selectedComponentId,
      description: componentDescription,
      /*
        To update a component, we need it's primary key.
        If the project component is new, it will not have a projComponentId, then it's safe to ignore.
      */
      ...(!!projComponentId ? { project_component_id: projComponentId } : {}),

      /*
        Now we need to insert the subcomponents previously generated.
      */
      moped_proj_components_subcomponents: {
        data: subcomponentChanges,
        on_conflict: {
          constraint: "moped_proj_components_subcomponents_pkey",
          update_columns: [
            "project_component_id",
            "subcomponent_id",
            "is_deleted",
          ],
        },
      },
      /*
        Finally we inject the features components & geojson features
        as previously generated.
      */
      moped_proj_features: {
        data: projectFeatures,
        on_conflict: {
          constraint: "moped_proj_features_pkey",
          update_columns: ["is_deleted", "feature"],
        },
      },
    };
    // Finally we must run the graphql query and refetch
    updateProjectComponents({
      variables: {
        objects: variablePayload,
      },
    }).then(() => saveActionDispatch({ type: "componentSaved" }));
  };

  /**
   * Handles the deletion of the component from database
   */
  const handleComponentDelete = () => {
    deleteProjectComponent({
      variables: {
        projComponentId: projComponentId,
      },
    }).then(() => exitAndReload());
  };

  /**
   * Tracks any changes made to selectedComponentId
   */
  useEffect(() => {
    // If we have data, look to update the selected subcomponents
    if (mopedSubcomponents && selectedComponentType !== null) {
      setSelectedSubcomponents([...subcomponentsDB]);
    } else {
      // If the component id changes, clear out the value of selected subcomponents
      setSelectedSubcomponents([]);
    }
    // eslint-disable-next-line
  }, [mopedSubcomponents, selectedComponentId, selectedComponentType]);

  /**
   * Tracks any changes made to the selected type and subtype
   */
  useEffect(() => {
    // If we don't have a type, then forget about it...
    if (selectedComponentType === null) {
      setSelectedComponentId(null);
      return;
    }

    // We have a type, let's check if we need to have a subtype
    const subtypeOptional = isSubtypeOptional(selectedComponentType);

    // Exit this function if needed
    if (subtypeOptional === false && selectedComponentSubtype === null) {
      setSelectedComponentId(null);
      return;
    }

    // We have what we need, let's get the component id
    const newComponentId = getSelectedComponentId(
      selectedComponentType,
      selectedComponentSubtype
    );

    // Update the selected component id
    setSelectedComponentId(newComponentId);

    // eslint-disable-next-line
  }, [selectedComponentType, selectedComponentSubtype]);

  /**
   * Initialize the feature collection that will track feature state throughought the editing session
   */
  useEffect(() => {
    const componentFeatureCollection = selectedComponentFeatureCollection
      ? selectedComponentFeatureCollection
      : EMPTY_FEATURE_COLLECTION;
    setEditFeatureCollection(componentFeatureCollection);
  }, [selectedProjectComponent, selectedComponentFeatureCollection]);

  /**
   * We have to wait to hear from the map that it is finished saving
   * the features it contains
   * */
  useEffect(() => {
    if (
      saveActionState?.currentStep === 2 && // Features are saved
      saveActionState?.featuresSaved
    )
      handleSaveButtonClick();

    if (
      saveActionState?.currentStep === 3 && // Component is saved
      saveActionState?.componentSaved
    )
      exitAndReload();
    /**
     * The 'handleSaveButtonClick' and 'exitAndReload' change on every render.
     * We cannot add them to the list otherwise it would
     * trigger an endless loop. Making eslint ignore it for now.
     */
    // eslint-disable-next-line
  }, [saveActionState]);

  /**
   * Returns true if the collection has a minimum of features, false otherwise.
   * @type {boolean}
   */
  const areMinimumFeaturesSet = editFeatureCollection
    ? countFeatures(editFeatureCollection) >= mapConfig.minimumFeaturesInProject
    : false;

  /**
   * Pre-populates the type and subtype for the existing data from DB
   */
  if (mopedComponents && initialTypeCounts && selectedComponentType === null) {
    // Get the component_id from the moped_proj_component table or make databaseComponent null
    const databaseComponent =
      projComponentId > 0
        ? mopedComponents.filter(
            (componentItem) =>
              componentItem.component_id ===
              selectedProjectComponent.component_id
          )[0]
        : null;

    // Determine component type and available subtypes
    const componentTypeDB = databaseComponent
      ? databaseComponent.component_name.toLowerCase()
      : null;

    // Update state with new values
    if (componentTypeDB !== selectedComponentType)
      setSelectedComponentType(componentTypeDB);

    // If there is a componentId, then get subtypes
    if (projComponentId) {
      // Now get the available subtypes
      const newStateAvailableSubTypes = getAvailableSubtypes(componentTypeDB);
      setAvailableSubtypes(newStateAvailableSubTypes);
      // If the component type has subtypes, then fetch those and update state
      if (initialTypeCounts[componentTypeDB].count > 1) {
        const subtypeDB = (databaseComponent?.component_subtype ?? "")
          .trim()
          .toLowerCase();
        setSelectedComponentSubtype(subtypeDB);
      }
      // check if selected component is represented by lines or points
      setDrawLines(
        selectedProjectComponent.moped_components.line_representation
      );
    }
  }

  // Populate component description if available and state is empty
  if (
    selectedProjectComponent &&
    !!selectedProjectComponent?.description &&
    componentDescription === null
  ) {
    setComponentDescription(selectedProjectComponent?.description);
  }

  const isSignalComponent = selectedComponentType
    ? selectedComponentType.toLowerCase() === "signal"
    : false;

  if (!editFeatureCollection) {
    return <CircularProgress color="inherit" />;
  }

  return (
    <Grid
      data-name={"moped-component-editor-grid"}
      className={classes.mapStyle}
    >
      <ProjectComponentsMap
        data-name={"moped-component-editor-ProjectComponentsMap"}
        featureCollection={editFeatureCollection}
        setFeatureCollection={setEditFeatureCollection}
        projectId={null}
        noPadding={true}
        newFeature={!selectedProjectComponent}
        projectFeatureCollection={projectFeatureCollection}
        saveActionState={saveActionState}
        saveActionDispatch={saveActionDispatch}
        isSignalComponent={isSignalComponent}
        drawLines={drawLines}
        componentEditorPanel={
          <>
            <MapToolsCollapse
              transitionInEditTools={editPanelCollapsed}
              onExitedEditTools={() => setEditPanelCollapsedShow(true)}
              transitionInShowTools={editPanelCollapsedShow}
              onShowToolsClick={() => setEditPanelCollapsedShow(false)}
              onExitShowTools={() => setEditPanelCollapsed(true)}
              showButtonText={"Show Component Details"}
            >
              <Grid container spacing={2}>
                <Grid item xs className={classes.layerSelectBox}>
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <Autocomplete
                        id="moped-project-select"
                        className={classes.formSelect}
                        value={
                          availableTypes.find(
                            (type) =>
                              type.toLowerCase() === selectedComponentType
                          ) || ""
                        }
                        options={[...availableTypes, ""]}
                        getOptionLabel={(component) => component}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Type"
                            variant="outlined"
                          />
                        )}
                        onChange={handleComponentTypeSelect}
                      />
                    </Grid>
                    {availableSubtypes.length > 0 && (
                      <Grid item xs={12}>
                        {!isSignalComponent && (
                          <Autocomplete
                            id="moped-project-subtype-select"
                            className={classes.formSelect}
                            value={
                              availableSubtypes.find(
                                (subtype) =>
                                  subtype.toLowerCase() ===
                                  selectedComponentSubtype
                              ) ?? null
                            }
                            options={[...new Set(availableSubtypes)].sort()}
                            getOptionLabel={(component) => component}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Subtype"
                                variant="outlined"
                              />
                            )}
                            onChange={handleComponentSubtypeSelect}
                          />
                        )}
                        {isSignalComponent && (
                          <SignalComponentAutocomplete
                            setEditFeatureCollection={setEditFeatureCollection}
                            editFeatureCollection={editFeatureCollection}
                            setSelectedComponentSubtype={
                              setSelectedComponentSubtype
                            }
                            className={classes.formSelect}
                          />
                        )}
                      </Grid>
                    )}
                    <ProjectComponentSubcomponents
                      componentId={selectedComponentId}
                      subcomponentList={mopedSubcomponents}
                      selectedSubcomponents={selectedSubcomponents}
                      setSelectedSubcomponents={setSelectedSubcomponents}
                    />
                    <Grid item xs={12}>
                      <TextField
                        className={classes.formTextField}
                        id="moped-component-description"
                        label="Description"
                        multiline
                        minRows={4}
                        variant="filled"
                        value={componentDescription ?? ""}
                        onChange={(e) => handleDescriptionKeyDown(e)}
                        fullWidth
                      />
                    </Grid>
                    {!areMinimumFeaturesSet && (
                      <Grid item xs={12}>
                        <Alert className={classes.mapAlert} severity="error">
                          You must select at least one feature for this
                          component.
                        </Alert>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Button
                        className={classes.formButton}
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          saveActionDispatch({ type: "initiateFeatureSave" })
                        }
                        // onClick={handleSaveButtonClick}
                        disabled={
                          !areMinimumFeaturesSet || selectedComponentId === null
                        }
                        startIcon={<Icon>save</Icon>}
                        size="small"
                      >
                        Save
                      </Button>
                      <Button
                        className={classes.formButton}
                        onClick={handleCancelEdit}
                        variant="contained"
                        color="secondary"
                        startIcon={<Icon>cancel</Icon>}
                        size="small"
                      >
                        Cancel
                      </Button>
                      {selectedProjectComponent && (
                        <Button
                          className={classes.formButton}
                          onClick={handleDeleteDialogClickOpen}
                          variant="outlined"
                          color="default"
                          startIcon={<Icon>delete</Icon>}
                          size="small"
                        >
                          Delete
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider
                    variant="fullWidth"
                    className={classes.mapToolsDivider}
                  />
                  <Button
                    onClick={() => setEditPanelCollapsed(false)}
                    startIcon={<KeyboardArrowUp />}
                    fullWidth
                  >
                    Hide All
                  </Button>
                </Grid>
              </Grid>

              <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteDialogClickClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  <div>
                    <h2>{"Delete Component?"}</h2>
                  </div>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    You cannot undo this operation, any subcomponents and
                    features will be lost.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleComponentDelete}
                    color="primary"
                    startIcon={<Icon>delete</Icon>}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={handleDeleteDialogClickClose}
                    color="default"
                    autoFocus
                    startIcon={<Icon>cancel</Icon>}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            </MapToolsCollapse>
          </>
        }
      />
    </Grid>
  );
};

export default ProjectComponentsMapEdit;
