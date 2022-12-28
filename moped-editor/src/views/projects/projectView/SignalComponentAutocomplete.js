import React from "react";
import { useState } from "react";
import { CircularProgress, TextField } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import {
  getSignalOptionLabel,
  getSignalOptionSelected,
  renderSignalInput,
  SOCRATA_ENDPOINT,
} from "src/utils/signalComponentHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";

/**
 * Material Autocomplete wrapper that enables selecting a traffic/phb signal record from a
 * Socrata dataset and setting it as a project component.
 * @param {Object} classes - MaterialUI style object
 * @param {Object} autocompleteProps - props to pass down to the MUI autocomplete component
 * @param {Function} onSignalChange - callback function to run when the signal is changed
 *  @return {JSX.Element}
 */
const SignalComponentAutocomplete = React.forwardRef(
  ({ classes, autocompleteProps, onSignalChange, onChange, value }, ref) => {
    const { features, loading, error } = useSocrataGeojson(SOCRATA_ENDPOINT);

    const handleSignalChange = (e, signal) => {
      onSignalChange(signal);
      console.log(signal);
    };

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
          // renderSignalInput(params, null, "outlined", "small")
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
