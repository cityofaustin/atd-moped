import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  Icon,
  TextField,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  COMPONENT_DETAILS_QUERY,
  UPDATE_MOPED_COMPONENT,
  DELETE_MOPED_COMPONENT,
} from "../../../queries/project";
import ProjectComponentSubcomponents from "./ProjectComponentSubcomponents";

import NewProjectMap from "../newProjectView/NewProjectMap";
import { Alert, Autocomplete } from "@material-ui/lab";
import { countFeatures, mapConfig, mapErrors } from "../../../utils/mapHelpers";
import { filterObjectByKeys } from "../../../utils/materialTableHelpers";
import { useParams } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formSelect: {
    width: "60%",
  },
  formButton: {
    margin: theme.spacing(2),
  },
  formButtonDelete: {
    float: "right",
    margin: theme.spacing(2),
  },
  formTextField: {
    margin: theme.spacing(2),
  },
  mapAlert: {
    margin: theme.spacing(2),
  },
}));

/**
 * The project component editor
 * @param {Number} componentId - The moped_proj_component id being edited
 * @param {function} handleCancelEdit - The function to call if we need to cancel editing
 * @param {Object} projectFeatureRecords - The a list of feature records
 * @param {Object} projectFeatureCollection - The feature collection GeoJSON
 * @param {function} projectRefetchFeatures - Reload parent component's features
 * @return {JSX.Element}
 * @constructor
 */
const ProjectComponentEdit = ({
  componentId,
  handleCancelEdit,
  projectFeatureRecords,
  projectFeatureCollection,
  projectRefetchFeatures,
}) => {
  const { projectId } = useParams();
  const classes = useStyles();
  const emptyCollection = {
    type: "FeatureCollection",
    features: [],
  };

  /**
   * The State
   * @type {String} selectedComponentType - A string containing the name of the selected type in lowercase
   * @type {String} selectedComponentSubtype - A string containing the name of the selected subtype in lowercase
   * @type {String[]} selectedComponentSubtype - A string containing all available subtypes for type
   * @constant
   */
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [selectedComponentType, setSelectedComponentType] = useState(null);
  const [selectedComponentSubtype, setSelectedComponentSubtype] = useState(
    null
  );
  const [selectedSubcomponents, setSelectedSubcomponents] = useState([]);
  const [availableSubtypes, setAvailableSubtypes] = useState([]);
  const [editFeatureCollection, setEditFeatureCollection] = useState(
    componentId === 0 ? emptyCollection : projectFeatureCollection
  );

  const [componentDescription, setComponentDescription] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  /**
   * Apollo hook functions
   */
  const { loading, data, error } = useQuery(COMPONENT_DETAILS_QUERY, {
    variables: {
      componentId: componentId,
    },
    fetchPolicy: "no-cache",
  });

  const [updateProjectComponents] = useMutation(UPDATE_MOPED_COMPONENT);

  const [deleteProjectComponent] = useMutation(DELETE_MOPED_COMPONENT);

  /**
   * Generates an initial list of component types, subtypes and counts
   */
  const initialTypeCounts = data
    ? data.moped_components.reduce((accumulator, component, index) => {
        const componentId = component?.component_id ?? null;
        const componentName = (component?.component_name ?? "").toLowerCase();
        const componentSubtype = (
          component?.component_subtype ?? ""
        ).toLowerCase();

        const componentSubcomponents = data.moped_subcomponents.filter(
          subcomponent => subcomponent.component_id === componentId
        );

        // Get the total count
        const currentCount = accumulator[componentName]?.count ?? 0;

        return {
          ...accumulator,
          [componentName]: {
            count: currentCount + 1,
            component_id: currentCount > 1 ? 0 : componentId,
            index: index,
            subtypes: {
              ...(accumulator[componentName]?.subtypes ?? {}),
              [componentSubtype]: {
                component_id: componentId,
                component_name: component?.component_name ?? null,
                component_subtype: component?.component_subtype ?? null,
              },
            },
            subcomponents: componentSubcomponents,
          },
        };
      }, {})
    : {};

  // Now check if we have any subcomponents in the DB
  const subcomponentsDB =
    (data?.moped_proj_components ?? []).length > 0
      ? data.moped_proj_components[0].moped_proj_components_subcomponents.map(
          subcomponent => ({
            ...subcomponent.moped_subcomponent,
            component_subcomponent_id: subcomponent.component_subcomponent_id,
          })
        )
      : [];

  /**
   * This is a constant list containing the names of available types
   * @type {String[]}
   */
  const availableTypes = data
    ? [
        ...new Set(
          data.moped_components.map(
            moped_component => moped_component.component_name
          )
        ),
      ].sort()
    : [];

  /**
   * Generates a list of available subtypes for a fiven type name
   * @param {String} type - The type name
   * @return {String[]} - A string array with the available subtypes
   */
  const getAvailableSubtypes = type =>
    Object.entries(initialTypeCounts[type]?.subtypes ?? {})
      .map(([_, component]) => (component?.component_subtype ?? "").trim())
      .filter(item => item.length > 0);

  /**
   * Returns any available subcomponent objects for a specific type
   * @param {String} type - Lower case of the name of the type
   * @return {Object[]}
   */
  const getAvailableSubcomponents = () =>
    initialTypeCounts[selectedComponentType].subcomponents;

  /**
   * Returns the current project componetn id
   * @return {number|null}
   */
  const getProjectComponentId = () =>
    data?.moped_proj_components[0]?.project_component_id ?? null;

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
    const availableSubTypes = getAvailableSubtypes(selectedType);

    // Set The selected component type
    setSelectedComponentType(selectedType);
    setAvailableSubtypes(availableSubTypes);
    setSelectedComponentSubtype(null);
  };

  /**
   * On select, it changes the value of selectedSubtype state
   * @param {Object} e - The event object
   * @param {String} newValue - The new value from the autocomplete selector
   */
  const handleComponentSubtypeSelect = (e, newValue) =>
    setSelectedComponentSubtype(
      (newValue ?? e.target.value ?? "").toLowerCase()
    );

  /**
   * Retrieves the component_id based no the type and subtype names
   * @param {string} type - The type name
   * @param {string} subtype - The subtype name
   */
  const getSelectedComponentId = (type, subtype) =>
    initialTypeCounts[type].count > 1
      ? initialTypeCounts[type].subtypes[subtype ?? ""]?.component_id ?? null
      : initialTypeCounts[type]?.component_id ?? null;

  /**
   * Returns true if the given type needs a subtype
   * @param {string} type
   * @return {boolean}
   */
  const isSubtypeOptional = type =>
    (initialTypeCounts[type]?.count ?? 0) === 1 ||
    Object.keys(initialTypeCounts[type]?.subtypes ?? {}).includes("");

  /**
   * Calls upsert project features mutation, refetches data, and handles dialog close on success
   */
  const generateMapUpserts = () => {
    const editedFeatures = editFeatureCollection.features;

    // Find new records that need to be inserted and create a feature record from them
    const newRecordsToInsert = editedFeatures
      .filter(
        feature =>
          !projectFeatureRecords.find(
            record =>
              feature.properties.PROJECT_EXTENT_ID ===
              record.location.properties.PROJECT_EXTENT_ID
          )
      )
      .map(feature => ({
        location: feature,
        status_id: 1,
      }));

    // Find existing records that need to be soft deleted, clean them, and set status to inactive
    const existingRecordsToUpdate =
      componentId !== 0
        ? projectFeatureRecords
            .map(record => filterObjectByKeys(record, ["__typename"]))
            .filter(
              record =>
                !editedFeatures.find(
                  feature =>
                    feature.properties.PROJECT_EXTENT_ID ===
                    record.location.properties.PROJECT_EXTENT_ID
                )
            )
            .map(record => ({
              ...record,
              status_id: 0,
            }))
        : []; // if this is a new component, there are no old records to update

    return [...newRecordsToInsert, ...existingRecordsToUpdate];
  };

  /**
   * Generates a list of subcomponents to be upserted in Hasura
   * @return {Object[]}
   */
  const generateSubcomponentUpserts = () => {
    // If there are no subcomponents, then remove them all if present.
    const removeAllSubcomponents = getAvailableSubcomponents().length === 0;

    // Generate a list of subcomponents to be removed
    const removalList = subcomponentsDB.filter(
      // Check every old subcomponent
      oldSubcomponent =>
        // If not found, mark it as true so it's part of the selectedSubcomponents list
        removeAllSubcomponents ||
        !selectedSubcomponents.find(
          newSubcomponent =>
            // Return true if we have found the old subcomponent in this list
            oldSubcomponent.subcomponent_id === newSubcomponent.subcomponent_id
        )
    );

    // Remove existing subcomponents, keep only those that need inserting
    const insertionList = selectedSubcomponents.filter(
      // If the subcomponent does not have component_subcomponent_id, then keep
      // Otherwise, it means it already exists in the database
      subcomponent => isNaN(subcomponent?.component_subcomponent_id)
    );

    // Generate output, clean up & return
    return [...insertionList, ...removalList]
      .map(subcomponent => ({
        ...subcomponent,
        status_id: isNaN(subcomponent?.component_subcomponent_id) ? 1 : 0,
      }))
      .map(record =>
        filterObjectByKeys(record, [
          "__typename",
          "component_id",
          "subcomponent_name",
        ])
      );
  };

  /**
   * Handles the key down events for the description field
   * @param {Object} e - The event object
   */
  const handleDescriptionKeyDown = e => {
    setComponentDescription(e.target.value);
  };

  /**
   * Handles the exit of the current edit screen and reloads
   */
  const exitAndReload = () => {
    handleCancelEdit();
    projectRefetchFeatures();
  };

  /**
   * Persists the changes to the database
   */
  const handleSaveButtonClick = () => {
    // Retrieve current project component id
    const projComponentId = getProjectComponentId();
    
    // Generate feature upserts
    const features = generateMapUpserts().map(feature => ({
      status_id: feature.status_id,
      moped_proj_feature_object: {
        on_conflict: {
          constraint: "moped_proj_features_pkey",
          update_columns: ["location", "status_id"],
        },
        data: {
          project_id: projectId,
          location: feature.location,
          status_id: feature.status_id,
        },
      },
    }));

    // 2. Generate a list of subcomponent upserts
    const subcomponentChanges = generateSubcomponentUpserts();

    // First update the map features: create, retire,
    // Associate the map features to the current component: upsert moped_proj_features_components

    const variablePayload = {
      name: "",
      project_id: Number.parseInt(projectId),
      status_id: 1,
      component_id: selectedComponentId,
      description: componentDescription,
      ...(!!projComponentId ? { project_component_id: projComponentId } : {}),
      moped_proj_components_subcomponents: {
        data: subcomponentChanges,
        on_conflict: {
          constraint: "moped_proj_components_subcomponents_pkey",
          update_columns: [
            "project_component_id",
            "subcomponent_id",
            "status_id",
          ],
        },
      },
    };

    updateProjectComponents({
      variables: {
        objects: variablePayload,
      },
    }).then(() => exitAndReload());
  };

  /**
   * Handles the deletion of the component
   */
  const handleComponentDelete = () => {
    deleteProjectComponent({
      variables: {
        projComponentId: componentId,
      },
    }).then(() => exitAndReload());
  };

  /**
   * Tracks any changes made to selectedComponentId
   */
  useEffect(() => {
    // If we have data, look to update the selected subcomponents
    if (data && selectedComponentType !== null) {
      setSelectedSubcomponents([...subcomponentsDB]);
    } else {
      // If the component id changes, clear out the value of selected subcomponents
      setSelectedSubcomponents([]);
    }
    // eslint-disable-next-line
  }, [data, selectedComponentId, selectedComponentType]);

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

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  /**
   * Returns true if the collection has a minimum of features, false otherwise.
   * @type {boolean}
   */
  const areMinimumFeaturesSet =
    countFeatures(editFeatureCollection) >= mapConfig.minimumFeaturesInProject;

  /**
   * Pre-populates the type and subtype for the existing data from DB
   */
  if (data && initialTypeCounts && selectedComponentType === null) {
    // Get the component_id from the moped_proj_component table or make databaseComponent null
    const databaseComponent =
      componentId > 0
        ? data.moped_components.filter(
            componentItem =>
              componentItem.component_id ===
              data.moped_proj_components[0].component_id
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
    if (componentId > 0) {
      // Now get the available subtypes
      const availableSubTypes = getAvailableSubtypes(componentTypeDB);
      setAvailableSubtypes(availableSubTypes);
      // If the component type has subtypes, then fetch those and update state
      if (initialTypeCounts[componentTypeDB].count > 1) {
        const subtypeDB = (databaseComponent?.component_subtype ?? "")
          .trim()
          .toLowerCase();
        setSelectedComponentSubtype(subtypeDB);
      }
    }
  }

  // Populate component description if available and state is empty
  if (
    data &&
    !!data?.moped_proj_components[0]?.description &&
    componentDescription === null
  ) {
    setComponentDescription(data?.moped_proj_components[0]?.description);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl variant="filled" fullWidth>
              <Autocomplete
                id="moped-project-select"
                className={classes.formSelect}
                value={availableTypes.find(
                  type => type.toLowerCase() === selectedComponentType
                )}
                options={availableTypes}
                getOptionLabel={component => component}
                renderInput={params => (
                  <TextField {...params} label="Type" variant="outlined" />
                )}
                onChange={handleComponentTypeSelect}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            {availableSubtypes.length > 0 && (
              <FormControl variant="filled" fullWidth>
                <Autocomplete
                  id="moped-project-subtype-select"
                  className={classes.formSelect}
                  value={availableSubtypes.find(
                    subtype =>
                      subtype.toLowerCase() === selectedComponentSubtype
                  )}
                  options={[...new Set(availableSubtypes)].sort()}
                  getOptionLabel={component => component}
                  renderInput={params => (
                    <TextField {...params} label="Subtype" variant="outlined" />
                  )}
                  onChange={handleComponentSubtypeSelect}
                />
              </FormControl>
            )}
          </Grid>
          <ProjectComponentSubcomponents
            componentId={selectedComponentId}
            subcomponentList={data?.moped_subcomponents}
            selectedSubcomponents={selectedSubcomponents}
            setSelectedSubcomponents={setSelectedSubcomponents}
          />
          <Grid xs={12}>
            <FormControl variant="filled" fullWidth>
              <TextField
                className={classes.formTextField}
                id="moped-component-description"
                label="Description"
                multiline
                rows={4}
                defaultValue=""
                variant="filled"
                value={componentDescription}
                onChange={e => handleDescriptionKeyDown(e)}
              />
            </FormControl>
          </Grid>
          {!areMinimumFeaturesSet && (
            <Grid xs={12}>
              <Alert className={classes.mapAlert} severity="error">
                You must select at least one feature for this component.
              </Alert>
            </Grid>
          )}
          <Grid xs={8}>
            <Button
              className={classes.formButton}
              variant="contained"
              color="primary"
              onClick={handleSaveButtonClick}
              disabled={!areMinimumFeaturesSet || selectedComponentId === null}
              startIcon={<Icon>save</Icon>}
            >
              Save
            </Button>
            <Button
              className={classes.formButton}
              onClick={handleCancelEdit}
              variant="contained"
              color="secondary"
              startIcon={<Icon>cancel</Icon>}
            >
              Cancel
            </Button>
          </Grid>
          <Grid xs={4} alignItems="right">
            {componentId > 0 && (
              <Button
                className={classes.formButtonDelete}
                onClick={handleDeleteDialogClickOpen}
                variant="outlined"
                color="default"
                startIcon={<Icon>delete</Icon>}
              >
                Delete
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={8}>
        <NewProjectMap
          featureCollection={editFeatureCollection}
          setFeatureCollection={setEditFeatureCollection}
          projectId={null}
          refetchProjectDetails={null}
          noPadding={true}
        />
        {error && (
          <Alert className={classes.mapAlert} severity="error">
            {mapErrors.failedToSave}
          </Alert>
        )}
      </Grid>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClickClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <h2>{"Delete Component?"}</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You cannot undo this operation, any subcomponents and features will
            be lost.
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
    </Grid>
  );
};

export default ProjectComponentEdit;
