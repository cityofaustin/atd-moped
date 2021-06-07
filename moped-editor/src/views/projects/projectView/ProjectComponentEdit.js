import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { COMPONENT_DETAILS_QUERY } from "../../../queries/project";
import ProjectComponentSubcomponents from "./ProjectComponentSubcomponents";

const useStyles = makeStyles(theme => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formSelect: {
    width: "60%",
  },
  formButton: {
    margin: theme.spacing(2),
  },
  formTextField: {
    margin: theme.spacing(2),
  },
}));

/**
 * The project component editor
 * @param {Number} componentId - The moped_proj_component id being edited
 * @param {function} handleCancelEdit - The function to call if we need to cancel editing
 * @return {JSX.Element}
 * @constructor
 */
const ProjectComponentEdit = ({ componentId, handleCancelEdit }) => {
  const classes = useStyles();

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

  /**
   * Apollo hook functions
   */
  const { loading, data, error } = useQuery(COMPONENT_DETAILS_QUERY, {
    variables: {
      componentId: componentId,
    },
  });

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
          },
        };
      }, {})
    : {};

  /**
   * Generates a list of available subtypes for a fiven type name
   * @param {String} type - The type name
   * @return {String[]} - A string array with the available subtypes
   */
  const getAvailableSubtypes = type =>
    Object.entries(initialTypeCounts[type].subtypes)
      .map(([_, component]) => (component?.component_subtype ?? "").trim())
      .filter(item => item.length > 0);

  /**
   * On select, it changes the available items for that specific type
   * @param {Object} e - The Object Type
   */
  const handleComponentTypeSelect = e => {
    const selectedType = (e.target.value ?? "").toLowerCase();

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
   */
  const handleComponentSubtypeSelect = e =>
    setSelectedComponentSubtype(e.target.value.toLowerCase());

  /**
   * Retrieves the component_id based no the type and subtype names
   * @param {string} type - The type name
   * @param {string} subtype - The subtype name
   */
  const getSelectedComponentId = (type, subtype) =>
    initialTypeCounts[type].count > 1
      ? initialTypeCounts[type].subtypes[subtype ?? ""].component_id
      : initialTypeCounts[type].component_id;

  /**
   * Returns true if the given type needs a subtype
   * @param {string} type
   * @return {boolean}
   */
  const isSubtypeOptional = type =>
    initialTypeCounts[type].count === 1 ||
    Object.keys(initialTypeCounts[type]?.subtypes ?? {}).includes("");

  /**
   * Persists the changes to the database
   */
  const handleSaveButtonClick = () => {
    console.log("We should persist the data now?");
  };

  /**
   * Tracks any changes made to the selected subcomponents list
   */
  useEffect(() => {
    console.log("selectedSubcomponents, state change: ", selectedSubcomponents);
  }, [selectedSubcomponents]);

  /**
   * Tracks any changes made to selectedComponentId
   */
  useEffect(() => {
    // If we have data, look to update the selected subcomponents
    if (data) {
      // Now check if we have any subcomponents in the DB
      const subcomponentsDB = data.moped_proj_components[0].moped_proj_components_subcomponents.map(
        subcomponent => subcomponent.moped_subcomponent
      );

      setSelectedSubcomponents([...subcomponentsDB]);
    } else {
      // If the component id changes, clear out the value of selected subcomponents
      setSelectedSubcomponents([]);
    }
  }, [data, selectedComponentId]);

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

  // Handle loading and error events
  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;

  /**
   * Pre-populates the type and subtype for the existing data from DB
   */
  if (data && initialTypeCounts && selectedComponentType === null) {
    // Get the component_id from the moped_proj_component table
    const databaseComponent = data.moped_components.filter(
      componentItem =>
        componentItem.component_id ===
        data.moped_proj_components[0].project_component_id
    )[0];

    // Determine component type and available subtypes
    const componentTypeDB = databaseComponent.component_name.toLowerCase();
    const availableSubTypes = getAvailableSubtypes(componentTypeDB);

    // Update state with new values
    setSelectedComponentType(componentTypeDB);
    setAvailableSubtypes(availableSubTypes);

    // If the component type has subtypes, then fetch those and update state
    if (initialTypeCounts[componentTypeDB].count > 1) {
      const subtypeDB = databaseComponent.component_subtype
        .trim()
        .toLowerCase();
      setSelectedComponentSubtype(subtypeDB);
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl variant="filled" fullWidth>
          <InputLabel id="mopedComponentType">Type</InputLabel>
          <Select
            className={classes.formSelect}
            labelId="mopedComponentType"
            id="mopedComponentTypeSelect"
            value={(selectedComponentType ?? "").toLowerCase()}
            onChange={handleComponentTypeSelect}
          >
            {[
              ...new Set(
                data.moped_components.map(
                  moped_component => moped_component.component_name
                )
              ),
            ]
              .sort()
              .map(moped_component => {
                return (
                  <MenuItem
                    key={`moped-component-menuitem-${moped_component}`}
                    value={moped_component.toLowerCase()}
                  >
                    {moped_component}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        {availableSubtypes.length > 0 && (
          <FormControl variant="filled" fullWidth>
            <InputLabel id="mopedComponentSubtype">Subtype</InputLabel>
            <Select
              className={classes.formSelect}
              labelId="mopedComponentSubtype"
              id="mopedComponentTypeSelect"
              value={(selectedComponentSubtype ?? "").toLowerCase()}
              onChange={handleComponentSubtypeSelect}
            >
              {[...new Set(availableSubtypes)].sort().map(subtype => {
                return (
                  <MenuItem
                    key={`moped-component-subtype-menuitem-${subtype}`}
                    value={subtype.toLowerCase()}
                  >
                    {subtype}
                  </MenuItem>
                );
              })}
            </Select>
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
          />
        </FormControl>
      </Grid>
      <Grid xs={12}>
        <Button
          className={classes.formButton}
          variant="contained"
          color="primary"
          onClick={handleSaveButtonClick}
        >
          Save
        </Button>
        <Button
          className={classes.formButton}
          onClick={handleCancelEdit}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProjectComponentEdit;
