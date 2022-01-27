import React from "react";
import { useState } from "react";
import { CircularProgress } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import {
  useSignalChangeEffect,
  getSignalOptionLabel,
  getSignalOptionSelected,
  useInitialSignalComponentValue,
  renderSignalInput,
  SOCRATA_ENDPOINT,
} from "src/utils/signalComponentHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";

/**
 * Material Autocomplete wrapper that enables selecting a traffic/phb signal record from a
 * Socrata dataset and setting it as a project component.
 * * @param {Object} setSelectedComponentSubtype - sets the selectedComponentSubtype from parent state
 * * @param {Object} setEditFeatureCollection - sets the editFeatureCollection from parent state
 * * @param {Boolean} editFeatureCollection - the geoJSON generated for all the the features in this component
 * * @param {Object} classes - MaterialUI style object
 *  @return {JSX.Element}
 */
const SignalComponentAutocomplete = ({
  classes,
  setSelectedComponentSubtype,
  setEditFeatureCollection,
  editFeatureCollection,
}) => {
  const [signal, setSignal] = useState(null);
  const { features, loading, error } = useSocrataGeojson(SOCRATA_ENDPOINT);

  useInitialSignalComponentValue(editFeatureCollection, setSignal);

  useSignalChangeEffect(
    signal,
    setSelectedComponentSubtype,
    setEditFeatureCollection
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
      onChange={(e, signal) => {
        setSignal(signal ? signal : null);
      }}
      loading={loading}
      options={features}
      renderInput={params => renderSignalInput(params, null, "outlined")}
      value={signal || null}
    />
  );
};

export default SignalComponentAutocomplete;
