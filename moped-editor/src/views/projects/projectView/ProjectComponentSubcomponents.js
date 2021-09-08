import React from "react";
import { Chip, Grid, TextField } from "@material-ui/core";
import { Alert, Autocomplete } from "@material-ui/lab";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  alert: {
    margin: "4px",
  },
}));

/**
 * Subcomponent List Tag editor
 * @param {Number} componentId - An integer that contains the current compoent id selected
 * @param {Object[]} subcomponentList - A list of objects containing all the available subcomponents
 * @param {Number[]} selectedSubcomponents - The current state containing a list of selected components
 * @param {function} setSelectedSubcomponents - The state setter for the current list state
 * @return {JSX.Element}
 * @constructor
 */
const ProjectComponentSubcomponents = ({
  componentId,
  subcomponentList,
  selectedSubcomponents,
  setSelectedSubcomponents,
}) => {
  const classes = useStyles();

  // There is nothing to render if the component id is not there
  if (componentId === null)
    return (
      <Alert className={classes.alert} severity="warning">
        You must select a type &amp; subtype.
      </Alert>
    );

  /**
   * We need to keep a list of the selected subcomponents with a hash map
   * @type {Object}
   */
  const selectedSubcomponentIdsHash = {};

  /**
   * We need a list of objects that contains our available subcomponents for this component type
   * @type {Object[]}
   */
  const availableSubcomponents = (subcomponentList ?? []).filter(
    // Append any available subcomponents for the current type
    subComponent => subComponent.component_id === componentId
  );

  /**
   * We need to have a quick list of available subcomponent id's so we
   * can determine if the selected subcomponents should be in our available options.
   * @type {Number[]}
   */
  const availableSubcomponentIds = availableSubcomponents.map(
    subComponent => subComponent.subcomponent_id
  );

  // Count the total number of available subcomponents we have for this component type
  const availableSubcomponentsCount = (availableSubcomponents ?? []).length;

  /**
   * We need a list of elements that are currently selected, but we must clear
   * any elements that do not belong for this component type or any duplicates
   * @type {Object[]}
   */
  const uniqueSelectedSubcomponents = (selectedSubcomponents ?? []) // do not assume selectedSubcomponents is an array
    // First, remove any subcomponents that do not belong in this type/subtype pair
    .filter(subComponent =>
      availableSubcomponentIds.includes(subComponent.subcomponent_id)
    )
    // Now let's remove duplicates, this can be tested using [...selectedSubcomponents,...selectedSubcomponents] above
    .filter(subComponent => {
      // Check if we already have the subcomponent id selected
      if (selectedSubcomponentIdsHash[subComponent.subcomponent_id] ?? false) {
        // We already have it, then exclude from output it by returning false
        return false;
      } else {
        // We do not have it, then make it part of our list
        selectedSubcomponentIdsHash[subComponent.subcomponent_id] = true;
      }
      // If we reach this point, we just added our subcomponent_id to the hash list
      return true;
    });

  // If we have zero, then no point to render the autocomplete react component
  if (availableSubcomponentsCount === 0) return null;

  return (
    <Grid item xs={12}>
      <Autocomplete
        multiple
        fullWidth
        id="moped-subcomponents"
        value={uniqueSelectedSubcomponents}
        onChange={(event, newValue) => {
          setSelectedSubcomponents([...newValue]);
        }}
        options={availableSubcomponents}
        // The list changes depending on available subcomponents for that specific type
        getOptionLabel={option => option.subcomponent_name}
        getOptionSelected={(option, value) =>
          option.subcomponent_id === value.subcomponent_id
        }
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={option.subcomponent_name}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={params => (
          <TextField
            {...params}
            label="Subcomponents"
            variant="outlined"
            placeholder={null}
          />
        )}
      />
    </Grid>
  );
};

export default ProjectComponentSubcomponents;
