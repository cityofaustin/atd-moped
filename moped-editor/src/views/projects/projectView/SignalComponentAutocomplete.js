import React from "react";
import { useState } from "react";
import { CircularProgress } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import {
  filterSignalOptions,
  useSignalChangeEffect,
  getSignalOptionLabel,
  getSignalOptionSelected,
  useInitialSignalComponentValue,
  renderSignalInput,
} from "src/utils/signalComponentHelpers";
const SOCRATA_ENDPOINT =
  "https://data.austintexas.gov/resource/p53x-x73x.geojson?$select=signal_id,location_name,location,signal_type&$order=signal_id asc&$limit=9999";

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
      filterOptions={filterSignalOptions}
      getOptionSelected={getSignalOptionSelected}
      // this label formatting mirrors the Data Tracker formatting
      getOptionLabel={getSignalOptionLabel}
      onChange={(e, signal) => {
        setSignal(signal ? signal : null);
      }}
      loading={loading}
      options={features}
      renderInput={renderSignalInput}
      value={signal || null}
    />
  );
};

export default SignalComponentAutocomplete;
