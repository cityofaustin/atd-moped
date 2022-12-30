import React from "react";
import { CircularProgress, TextField } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import {
  getSignalOptionLabel,
  getSignalOptionSelected,
  SOCRATA_ENDPOINT,
} from "src/utils/signalComponentHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";

/**
 * Material Autocomplete wrapper that enables selecting a traffic/phb signal record from a
 * Socrata dataset and setting it as a project component.
 * @param {Object} classes - MaterialUI style object
 * @param {Object} autocompleteProps - props to pass down to the MUI autocomplete component
 * @param {Function} onChange - callback function to run when the signal is changed for React Hook Form
 * @param {Object} value - the signal feature to set as the value of the autocomplete from React Hook Form
 * @return {JSX.Element}
 */
const SignalComponentAutocomplete = React.forwardRef(
  ({ classes, autocompleteProps, onChange, value, componentSubtype }, ref) => {
    const { features, loading, error } = useSocrataGeojson(SOCRATA_ENDPOINT);
    // TODO: Filter by subtype, figure out if there are RRFB or School Zone Beacon entries in the dataset
    const featuresFilteredBySubtype = features?.filter(
      (feature) =>
        feature.properties.signal_type.toLowerCase() ===
        componentSubtype.toLowerCase()
    );

    if (loading) {
      return <CircularProgress color="primary" size={20} />;
    } else if (error) {
      return (
        <Alert severity="error">{`Unable to load signal list: ${error}`}</Alert>
      );
    }

    return (
      <Autocomplete
        className={classes}
        id="signal-id"
        filterOptions={filterOptions}
        getOptionSelected={getSignalOptionSelected}
        // this label formatting mirrors the Data Tracker formatting
        getOptionLabel={getSignalOptionLabel}
        onChange={onChange}
        loading={loading}
        options={features}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={ref}
            error={error}
            InputLabelProps={{ required: false }}
            label="Signal"
            required
            helperText="Required"
            variant="outlined"
            size="small"
          />
        )}
        value={value}
        {...autocompleteProps}
      />
    );
  }
);

export default SignalComponentAutocomplete;
