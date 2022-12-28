import React from "react";
import { useState } from "react";
import { CircularProgress } from "@material-ui/core";
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
const SignalComponentAutocomplete = ({
  classes,
  autocompleteProps,
  onSignalChange,
}) => {
  const [signal, setSignal] = useState(null);
  const { features, loading, error } = useSocrataGeojson(SOCRATA_ENDPOINT);

  const handleSignalChange = (e, signal) => {
    setSignal(signal);
    onSignalChange();
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
      onChange={handleSignalChange}
      loading={loading}
      options={features}
      renderInput={(params) =>
        renderSignalInput(params, null, "outlined", "small")
      }
      value={signal || null}
      {...autocompleteProps}
    />
  );
};

export default SignalComponentAutocomplete;
