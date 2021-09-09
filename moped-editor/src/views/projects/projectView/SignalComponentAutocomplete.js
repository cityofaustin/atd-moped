import React from "react";
import { useState } from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import { useSignalChangeEffect, useInitialSignalComponentValue } from "src/utils/signalComponentHelpers";
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
      filterOptions={(options, { inputValue, getOptionLabel }) => {
        // limits options to ensure fast rendering
        const limit = 40;
        // applies the default autcomplete matching behavior plus our limit filter
        const filteredOptions = options.filter(option =>
          getOptionLabel(option)
            .toLowerCase()
            .includes(inputValue.toLowerCase())
        );
        return filteredOptions.slice(0, limit);
      }}
      getOptionSelected={(option, value) =>
        option.properties?.signal_id === value.properties?.signal_id
      }
      // this label formatting mirrors the Data Tracker formatting
      getOptionLabel={option =>
        `${option.properties.signal_id}: ${option.properties.location_name}`
      }
      onChange={(e, signal) => {
        setSignal(signal ? signal : null);
      }}
      loading={loading}
      options={features}
      renderInput={params => (
        <TextField
          {...params}
          helperText="Required"
          label="Signal"
          variant="outlined"
        />
      )}
      value={signal || null}
    />
  );
};

export default SignalComponentAutocomplete;
