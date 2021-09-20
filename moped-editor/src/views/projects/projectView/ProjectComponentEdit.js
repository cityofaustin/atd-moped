import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  CircularProgress,
  Collapse,
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
  COMPONENT_DETAILS_QUERY,
  UPDATE_MOPED_COMPONENT,
  DELETE_MOPED_COMPONENT,
} from "../../../queries/project";
import ProjectComponentSubcomponents from "./ProjectComponentSubcomponents";
import SignalComponentAutocomplete from "./SignalComponentAutocomplete";
import NewProjectMap from "../newProjectView/NewProjectMap";
import { Alert, Autocomplete } from "@material-ui/lab";
import {
  countFeatures,
  mapConfig,
  mapErrors,
  useSaveActionReducer,
} from "../../../utils/mapHelpers";
import { filterObjectByKeys } from "../../../utils/materialTableHelpers";
import { useParams } from "react-router-dom";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
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
  mapTools: {
    position: "absolute",
    top: "4rem",
    left: "1rem",
    zIndex: "1",
    width: "21rem",
    background: theme.palette.common.white,
    border: "lightgray 1px solid",
    borderRadius: ".5rem",
    padding: ".5rem",
  },
  mapToolsShowHidden: {
    position: "absolute",
    top: "4rem",
    left: "1rem",
    zIndex: "1",
    width: "21rem",
    background: theme.palette.common.white,
    border: "lightgray 1px solid",
    borderRadius: ".5rem",
    padding: ".5rem",
    "&:hover": {
      background: theme.palette.common.white,
    },
  },
  mapToolsDivider: {
    marginTop: ".5rem",
  },
  layerSelectBox: {
    maxHeight: "35vh",
    overflow: "scroll",
  },
}));

/**
 * The project component editor
 * @param {Number} componentId - The moped_proj_component id being edited
 * @param {function} handleCancelEdit - The function to call if we need to cancel editing
 * @param {Object} projectFeatureCollection - The entire project's feature collection GeoJSON (optional)
 * @return {JSX.Element}
 * @constructor
 */
const ProjectComponentEdit = ({
  componentId,
  handleCancelEdit,
  projectFeatureCollection = null,
}) => {
  const { projectId } = useParams();
  const classes = useStyles();

  // Template that should keep all features for this component
  const emptyFeatureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  /**
   * The State
   * @type selectedComponentId -
   * @type {String} selectedComponentType - A string containing the name of the selected type in lowercase
   * @type {String} selectedComponentSubtype - A string containing the name of the selected subtype in lowercase
   * @type {String[]} selectedComponentSubtype - A string list containing all available subtypes for type
   * @type {Number[]} selectedSubcomponents - A number array containing the id of the selected subcomponents
   * @type {String[]} availableSubtypes - An string list containing all available subtypes for the selected component
   * @type {Object[]} editFeatureComponents - An object list containing the features for this component
   * @type {Object} editFeatureCollection - The final GeoJson generated for all the the features in this component
   * @type {String} componentDescription - The description of this component
   * @type {boolean} deleteDialogOpen - If true, it displays the delete dialog, or hides it if false.
   * @type editPanelCollapsed
   * @type editPanelCollapsedShow
   * @constant
   */
  const [selectedComponentId, setSelectedComponentId] = useState(null);
  const [selectedComponentType, setSelectedComponentType] = useState(null);
  const [selectedComponentSubtype, setSelectedComponentSubtype] = useState(
    null
  );
  const [selectedSubcomponents, setSelectedSubcomponents] = useState([]);
  const [availableSubtypes, setAvailableSubtypes] = useState([]);
  const [editFeatureComponents, setEditFeatureComponents] = useState([]);
  const [editFeatureCollection, setEditFeatureCollection] = useState(
    emptyFeatureCollection
  );
  const [drawLines, setDrawLines] = useState(null);

  const [componentDescription, setComponentDescription] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editPanelCollapsed, setEditPanelCollapsed] = useState(true);
  const [editPanelCollapsedShow, setEditPanelCollapsedShow] = useState(false);

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
   * saveActionState contains the current save state
   * saveActionDispatch allows us to update the state via action (signal) dispatch.
   */
  const { saveActionState, saveActionDispatch } = useSaveActionReducer();

  /**
   * Generates an initial list of component types, subtypes and counts (counts is total number of subtypes)
   * todo chia: ask if this initial list ever changes? or is it our constant list of component types, subtypes
   */
  const initialTypeCounts = data // Do we have data?
    ? // Yes, let's get the counts by using reduce
      data.moped_components.reduce((accumulator, component, index) => {
        // Retrieve the current component's values, in lower case
        const componentId = component?.component_id ?? null;
        const componentName = (component?.component_name ?? "").toLowerCase();
        const componentSubtype = (
          component?.component_subtype ?? ""
        ).toLowerCase();

        /**
         * Then, retrieve the subcomponents associated to this component. We must preserve
         * known subcomponents for other subtypes of the same component name.
         * TODO: refactor "initialTypeCounts" and form inputs to key on component_id
         * throughout. Gulp!
         */
        const currentSubcomponents =
          accumulator[componentName]?.subcomponents || [];

        const currentSubcomponentNames = currentSubcomponents.map(
          subcomponent => subcomponent.subcomponent_name
        );

        const componentSubcomponents = data.moped_subcomponents.filter(
          subcomponent =>
            subcomponent.component_id === componentId &&
            !currentSubcomponentNames.includes(subcomponent.subcomponent_name)
        );

        // Get the total count for this component name
        const currentCount = accumulator[componentName]?.count ?? 0;

        // Send back to the accumulator a copy of itself plus new data:
        return {
          // Here is the copy of the current state of the output:
          ...accumulator,
          // And for new data, create (or overwrite) a new key with the component name
          [componentName]: {
            count: currentCount + 1, // Assign count to currentCount + 1
            /**
             * If currentCount is zero, it means this is the first iteration of reduce
             * for this componentName, which means this should be considered a single item
             * and we need to give it its component_id.
             *
             * Otherwise, this is another iteration (n+1) for this componentName, which means
             * componentName is a group. Let's give it an id of zero as a lazy way to categorize
             * and differentiate groups from single items.
             */
            component_id: currentCount > 1 ? 0 : componentId,
            // Provide Index for context
            index: index,
            // Initialize a subtypes key with an object containing componentSubtype information.
            subtypes: {
              // Copy the current state of the accumulator's subtypes
              ...(accumulator[componentName]?.subtypes ?? {}),
              /**
               * Create (or overwrite) a new subtype by the name of componentSubtype,
               * containing all the data of this component iteration.
               */
              [componentSubtype]: {
                component_id: componentId,
                component_name: component?.component_name ?? null,
                component_subtype: component?.component_subtype ?? null,
              },
            },
            subcomponents: [...currentSubcomponents, ...componentSubcomponents],
          },
        };
      }, {})
    : {};

  // Now check if we have any subcomponents in the DB
  const subcomponentsDB =
    /**
     * Get moped_proj_components or assume empty array, if the array is empty it means
     * the user has not selected a component; which should never be the case. Do we have
     * a selected component? (is the count greater than zero?)
     */
    (data?.moped_proj_components ?? []).length > 0
      ? // Yes, we have project a component, now gather a list of subcomponents for that component
        data.moped_proj_components[0].moped_proj_components_subcomponents.map(
          subcomponent => ({
            ...subcomponent.moped_subcomponent,
            component_subcomponent_id: subcomponent.component_subcomponent_id,
          })
        )
      : // Nothing to do here, no valid component is selected.
        [];

  /**
   * This is a unique sorted list containing the names of available components
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

  // list of components that are represented by lines ** note: highway can be either
  const lineRepresentable = data
    ? [
        ...new Set(
          data.moped_components.map(moped_component =>
            moped_component?.line_representation
              ? moped_component.component_name.toLowerCase()
              : null
          )
        ),
      ].filter(item => item)
    : [];

  /**
   * Generates a list of available subtypes for a given type name
   * @param {String} type - The type name
   * @return {String[]} - A string array with the available subtypes
   */
  const getAvailableSubtypes = type =>
    // For every subtype found in initialTypeCounts[type]
    Object.entries(initialTypeCounts[type]?.subtypes ?? {})
      // Destructure the key and value (_ & component, respectively) and gather the name
      .map(([_, component]) => (component?.component_subtype ?? "").trim())
      .filter(item => item.length > 0); // Keep only if the name is not empty

  /**
   * Returns any available subcomponent objects for a specific type
   * @param {String} type - Lower case of the name of the type
   * @return {Object[]}
   */
  const getAvailableSubcomponents = () =>
    initialTypeCounts[selectedComponentType].subcomponents;

  /**
   * Returns the current project component id
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
    const newAvailableSubTypes = getAvailableSubtypes(selectedType);

    // Set The selected component type
    setSelectedComponentType(selectedType);
    setAvailableSubtypes(newAvailableSubTypes);
    setSelectedComponentSubtype(null);
    !!selectedType
      ? setDrawLines(lineRepresentable.indexOf(selectedType) > -1)
      : setDrawLines(null);
  };

  /**
   * On select, it changes the value of selectedSubtype state
   * @param {Object} e - The event object
   * @param {String} newValue - The new value from the autocomplete selector
   */
  const handleComponentSubtypeSelect = (e, newValue) => {
    setSelectedComponentSubtype(
      (newValue ?? e.target.value ?? "").toLowerCase()
    );
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
  const isSubtypeOptional = type =>
    (initialTypeCounts[type]?.count ?? 0) === 1 ||
    Object.keys(initialTypeCounts[type]?.subtypes ?? {}).includes("");

  /**
   * Calls upsert project features mutation, refetches data, and handles dialog close on success
   */
  const generateMapUpserts = () => {
    const editedFeatures = editFeatureCollection.features;
    // Find new records that need to be inserted and create a feature record from them
    const newFeaturesToInsert = editedFeatures
      .filter(
        newFeature =>
          !editFeatureComponents.find(
            existingRecord =>
              newFeature?.properties?.PROJECT_EXTENT_ID ===
              existingRecord.properties.PROJECT_EXTENT_ID
          )
      )
      .map(newFeature => ({
        ...newFeature,
        status_id: 1,
      }));

    // Find existing records that need to be soft deleted, clean them, and set status to inactive
    const existingFeaturesToDelete =
      componentId !== 0
        ? editFeatureComponents
            .map(record => filterObjectByKeys(record, ["__typename"]))
            .filter(
              record =>
                !editedFeatures.find(
                  feature =>
                    feature.properties.PROJECT_EXTENT_ID ===
                    record.properties.PROJECT_EXTENT_ID
                )
            )
            .map(record => ({
              ...record,
              feature_id: record.properties.moped_proj_feature_id,
              status_id: 0,
            }))
        : []; // if this is a new component, there are no old records to update

    return [...newFeaturesToInsert, ...existingFeaturesToDelete];
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
    return (
      [...insertionList, ...removalList] // Mix both insertion and removal list
        // For each subcomponent, mark for deletion (status_id = 0) if component_subcomponent_id has a number
        .map(subcomponent => ({
          ...subcomponent,
          status_id: isNaN(subcomponent?.component_subcomponent_id) ? 1 : 0,
        }))
        // Then remove certain objects by their key names from the output
        .map(record =>
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
  const handleDescriptionKeyDown = e => {
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
    // Retrieve current project component id
    const projComponentId = getProjectComponentId();

    // First, we need a list of map changes only
    const mapListOfChanges = generateMapUpserts();

    // For each change, we generate a list of feature component objects
    const featureComponents = mapListOfChanges.map(feature => ({
      // Each feature component shares the status of it's child feature
      status_id: feature.status_id,
      // Now we must determine if the feature has a nested `project_features_components_id` field
      ...(feature?.properties?.project_features_components_id ?? null
        ? // If so, then add it to the object, so that it can be upserted
          {
            project_features_components_id:
              feature.properties.project_features_components_id,
          }
        : // If not, ignore it so that we can insert a new one
          {}),
      // Create the moped_proj_feature_object key with conflict rules and data
      moped_proj_feature_object: {
        on_conflict: {
          constraint: "moped_proj_features_pkey",
          update_columns: ["location", "status_id"],
        },
        // This inserts into moped_proj_features, and assumes relationship with moped_proj_features_components
        data: {
          ...(feature.hasOwnProperty("feature_id")
            ? { feature_id: feature.feature_id }
            : {}),
          project_id: Number.parseInt(projectId),
          location: { ...feature },
          status_id: feature.status_id,
        },
      },
    }));

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
      status_id: 1,
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
            "status_id",
          ],
        },
      },
      /*
        Finally we inject the features components & geojson features
        as previously generated.
      */
      moped_proj_features_components: {
        data: featureComponents,
        on_conflict: {
          constraint: "moped_proj_features_components_pkey",
          update_columns: [
            "moped_proj_features_id",
            "moped_proj_component_id",
            "name",
            "description",
            "status_id",
          ],
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
      const newStateAvailableSubTypes = getAvailableSubtypes(componentTypeDB);
      setAvailableSubtypes(newStateAvailableSubTypes);
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

  /**
   * We need to populate the features we will need in order to build the
   * geojson collection that we can feed it to the map.
   */
  if (data && editFeatureComponents.length === 0) {
    // First, we will need a list of all moped_proj_features_components and make it geojson
    const featuresFromComponents = (
      data?.moped_proj_components[0]?.moped_proj_features_components ?? []
    ).map(featureComponent => {
      // Retrieve the feature component's primary key
      const {
        moped_proj_features_id,
        project_features_components_id,
      } = featureComponent;
      // Clone the geojson data from the feature component
      const newGeoJson = {
        ...featureComponent.moped_proj_feature.location,
      };
      // Now go ahead and patch the primary key into the GeoJson properties
      newGeoJson.properties.project_features_components_id = project_features_components_id;
      newGeoJson.properties.moped_proj_feature_id = moped_proj_features_id;

      return newGeoJson;
    });

    /**
     * Secondly, use emptyFeatureCollection as a template, then inject our previously rendered features
     */
    const featureCollectionFromComponents = {
      ...emptyFeatureCollection,
      features: featuresFromComponents,
    };

    // Unless we have features to work with, then leave it alone
    if (featuresFromComponents.length > 0) {
      setEditFeatureComponents(featuresFromComponents);
      setEditFeatureCollection(featureCollectionFromComponents);
    }
  }
  const isSignalComponent = selectedComponentType
    ? selectedComponentType.toLowerCase() === "signal"
    : false;

  return (
    <Grid
      data-name={"moped-component-editor-grid"}
      className={classes.mapStyle}
    >
      <NewProjectMap
        data-name={"moped-component-editor-newprojectmap"}
        featureCollection={editFeatureCollection}
        setFeatureCollection={setEditFeatureCollection}
        projectId={null}
        refetchProjectDetails={null}
        noPadding={true}
        newFeature={componentId === 0}
        projectFeatureCollection={projectFeatureCollection}
        saveActionState={saveActionState}
        saveActionDispatch={saveActionDispatch}
        isSignalComponent={isSignalComponent}
        drawLines={drawLines}
        componentEditorPanel={
          <>
            <Collapse
              in={editPanelCollapsedShow}
              onExit={() => setEditPanelCollapsed(true)}
            >
              <Button
                className={classes.mapToolsShowHidden}
                size={"small"}
                onClick={() => setEditPanelCollapsedShow(false)}
                startIcon={<KeyboardArrowDown />}
              >
                Show Component Details
              </Button>
            </Collapse>
            <Collapse
              className={classes.mapTools}
              in={editPanelCollapsed}
              onExited={() => setEditPanelCollapsedShow(true)}
            >
              <Grid container>
                <Grid item xs={12} className={classes.layerSelectBox}>
                  <Grid container spacing={1} xs={12} style={{ margin: 0 }}>
                    <Grid item xs={12}>
                      <Autocomplete
                        id="moped-project-select"
                        className={classes.formSelect}
                        value={
                          availableTypes.find(
                            type => type.toLowerCase() === selectedComponentType
                          ) || ""
                        }
                        options={[...availableTypes, ""]}
                        getOptionLabel={component => component}
                        renderInput={params => (
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
                                subtype =>
                                  subtype.toLowerCase() ===
                                  selectedComponentSubtype
                              ) ?? null
                            }
                            options={[...new Set(availableSubtypes)].sort()}
                            getOptionLabel={component => component}
                            renderInput={params => (
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
                      subcomponentList={data?.moped_subcomponents}
                      selectedSubcomponents={selectedSubcomponents}
                      setSelectedSubcomponents={setSelectedSubcomponents}
                    />
                    <Grid xs={12}>
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
                        fullWidth
                      />
                    </Grid>
                    {!areMinimumFeaturesSet && (
                      <Grid xs={12}>
                        <Alert className={classes.mapAlert} severity="error">
                          You must select at least one feature for this
                          component.
                        </Alert>
                      </Grid>
                    )}
                    <Grid xs={12} spacing={0}>
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
                      {componentId > 0 && (
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
                  <Divider fullWidth className={classes.mapToolsDivider} />
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
                  <h2>{"Delete Component?"}</h2>
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
            </Collapse>
          </>
        }
      />
      {error && (
        <Alert className={classes.mapAlert} severity="error">
          {mapErrors.failedToSave}
        </Alert>
      )}
    </Grid>
  );
};

export default ProjectComponentEdit;
