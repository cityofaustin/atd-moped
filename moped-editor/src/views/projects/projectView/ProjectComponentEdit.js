import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Button,
  Chip,
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
import { Autocomplete } from "@material-ui/lab";

const useStyles = makeStyles(theme => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  formSelect: {
    width: "60%",
  },
  formButton: {
    margin: theme.spacing(1),
  },
}));

// Test subcomponent entries
const testSubcomponentEntries = [
  { name: "SubComponent A", subcomponent_id: 1 },
  { name: "SubComponent B", subcomponent_id: 2 },
  { name: "SubComponent C", subcomponent_id: 3 },
  { name: "SubComponent D", subcomponent_id: 4 },
  { name: "SubComponent E", subcomponent_id: 5 },
  { name: "SubComponent F", subcomponent_id: 6 },
  { name: "SubComponent G", subcomponent_id: 7 },
  { name: "SubComponent H", subcomponent_id: 8 },
  { name: "SubComponent I", subcomponent_id: 9 },
  { name: "SubComponent J", subcomponent_id: 10 },
  { name: "SubComponent K", subcomponent_id: 11 },
  { name: "SubComponent L", subcomponent_id: 12 },
  { name: "SubComponent M", subcomponent_id: 13 },
  { name: "SubComponent N", subcomponent_id: 14 },
  { name: "SubComponent O", subcomponent_id: 15 },
  { name: "SubComponent P", subcomponent_id: 16 },
  { name: "SubComponent Q", subcomponent_id: 17 },
  { name: "SubComponent R", subcomponent_id: 18 },
  { name: "SubComponent S", subcomponent_id: 19 },
  { name: "SubComponent T", subcomponent_id: 20 },
  { name: "SubComponent U", subcomponent_id: 21 },
  { name: "SubComponent V", subcomponent_id: 22 },
  { name: "SubComponent W", subcomponent_id: 23 },
  { name: "SubComponent X", subcomponent_id: 24 },
  { name: "SubComponent Y", subcomponent_id: 25 },
  { name: "SubComponent Z", subcomponent_id: 26 }
];

/**
 * The project component editor
 * @param {Number} componentId - The moped_proj_component id being edited
 * @param {function} cancelEdit - The function to call if we need to cancel editing
 * @return {JSX.Element}
 * @constructor
 */
const ProjectComponentEdit = ({ componentId, cancelEdit }) => {
  const classes = useStyles();

  /**
   * The State
   * @type {String} selectedComponentType - A string containing the name of the selected type in lowercase
   * @type {String} selectedComponentSubtype - A string containing the name of the selected subtype in lowercase
   * @type {String[]} selectedComponentSubtype - A string containing all available subtypes for type
   * @constant
   */
  const [selectedComponentType, setSelectedComponentType] = useState(null);
  const [selectedComponentSubtype, setSelectedComponentSubtype] = useState(
    null
  );
  const [availableSubtypes, setAvailableSubtypes] = useState([]);

  /**
   * Apollo hook functions
   */
  const { loading, data, error } = useQuery(COMPONENT_DETAILS_QUERY, {
    variables: {
      componentId: componentId,
    },
  });

  const [value, setValue] = useState([]);

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
      .map(([_, component]) => component.component_subtype.trim())
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
  };

  /**
   * On select, it changes the value of selectedSubtype state
   * @param {Object} e - The event object
   */
  const handleComponentSubtypeSelect = e =>
    setSelectedComponentSubtype(e.target.value.toLowerCase());

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
      <Grid item xs={12}>
        <FormControl variant="filled" fullWidth>
          <Autocomplete
            multiple
            id="moped-subcomponents"
            value={value}
            onChange={(event, newValue) => {
              setValue([...newValue]);
            }}
            options={testSubcomponentEntries}
            getOptionLabel={option => option.name}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} />
              ))
            }
            style={{ width: 500 }}
            renderInput={params => (
              <TextField
                {...params}
                label="Subcomponents"
                variant="outlined"
                placeholder={null}
              />
            )}
          />
        </FormControl>
      </Grid>
      <Grid xs={12}>
        <Button
          className={classes.formButton}
          variant="contained"
          color="primary"
        >
          Save
        </Button>
        <Button
          className={classes.formButton}
          onClick={cancelEdit}
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
