import React from "react";
import { Chip, FormControl, Grid, TextField } from "@material-ui/core";
import { Alert, Autocomplete } from "@material-ui/lab";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  alert: {
    margin: theme.spacing(2),
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

  // Count the total number of available subcomponents we have for this component type
  const availableSubcomponentsCount = (subcomponentList ?? []).filter(
    subComponent => subComponent.component_id === componentId
  ).length;

  // If we have zero, then no point to render the autocomplete react component
  if (availableSubcomponentsCount === 0)
    return (
      <Alert className={classes.alert} severity="info">
        There are no available subcomponents for this component type.
      </Alert>
    );

  return (
    <Grid item xs={12}>
      <FormControl variant="filled" fullWidth>
        <Autocomplete
          multiple
          fullWidth
          id="moped-subcomponents"
          value={selectedSubcomponents}
          onChange={(event, newValue) => {
            setSelectedSubcomponents([...newValue]);
          }}
          options={[
            ...selectedSubcomponents, // We must show existing selected subcomponents, even if there is a mismatch
            ...subcomponentList.filter(
              // Then append any available subcomponents for the current type
              subComponent => subComponent.component_id === componentId
            ),
          ]}
          // The list changes depending on available subcomponents for that specific type
          getOptionLabel={option => option.subcomponent_name}
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
      </FormControl>
    </Grid>
  );
};

export default ProjectComponentSubcomponents;
