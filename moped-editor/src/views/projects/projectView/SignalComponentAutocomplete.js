import React, { useEffect } from "react";
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
 * @param {Function} onChange - callback function to run when the signal is changed for React Hook Form
 * @param {Object} value - the signal feature to set as the value of the autocomplete from React Hook Form
 * @param {Function} onOptionsLoaded - callback function to run when the options are loaded
 * @return {JSX.Element}
 */
const SignalComponentAutocomplete = React.forwardRef(
  ({ classes, onChange, value, onOptionsLoaded }, ref) => {
    const { features, loading, error } = useSocrataGeojson(SOCRATA_ENDPOINT);

    // Let the parent component know that the options are ready to go
    useEffect(() => {
      if (features === null) return;

      onOptionsLoaded();
    }, [features, onOptionsLoaded]);

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
        onChange={(_event, option) => onChange(option)}
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
      />
    );
  }
);

export default SignalComponentAutocomplete;
