import React from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import { signalToFeatureCollection } from "src/utils/mapHelpers";

const SOCRATA_ENDPOINT =
  "https://data.austintexas.gov/resource/p53x-x73x.geojson?$select=signal_id,location_name,location,signal_type&$order=signal_id asc&$limit=9999";

const useInitialComponentValue = (editFeatureCollection, setSignal) => {
  /*
  / initializes the selected signal value - handles case of editing existing component
  / tests for signal_id prop to ensure we're not handing a non-signal component (which happens
  / e.g. when an existing component's type is changed)
  */
  useEffect(() => {
    if (
      !editFeatureCollection ||
      editFeatureCollection.features.length === 0 ||
      !editFeatureCollection.features[0].properties.signal_id
    ) {
      setSignal("");
      return;
    } else if (editFeatureCollection.features.length > 1) {
      /*
      / If a non-signal component is edited, all previously-defined feature geometries
      / will be dropped.
      */
      console.warn(
        "Found signal component with multiple feature geometries. All but one feature will be removed."
      );
    }
    setSignal(editFeatureCollection.features[0]);
    // only fire on init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

/*
/ Hook which updates the component editor state based on the selected signal
*/
const useSignalChangeEffect = (
  signal,
  setSelectedComponentSubtype,
  setEditFeatureCollection,
) => {
  useEffect(() => {
    const signalSubtype = signal
      ? signal.properties.signal_type.toLowerCase()
      : "";
    const featureCollection = signalToFeatureCollection(signal);
    setSelectedComponentSubtype(signalSubtype);
    setEditFeatureCollection(featureCollection);
  }, [
    signal,
    setSelectedComponentSubtype,
    setEditFeatureCollection,
  ]);
};

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
  const [signal, setSignal] = useState("");
  const { features, loading, error } = useSocrataGeojson(SOCRATA_ENDPOINT);
  const options = features ? [...features, ""] : [""];

  useInitialComponentValue(editFeatureCollection, setSignal);

  useSignalChangeEffect(
    signal,
    setSelectedComponentSubtype,
    setEditFeatureCollection,
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
      getOptionSelected={(option, value) => {
        return value
          ? option.properties?.signal_id === value.properties?.signal_id
          : option === "";
      }}
      // this label formatting mirrors the Data Tracker formatting
      getOptionLabel={option =>
        option
          ? `${option.properties.signal_id}: ${option.properties.location_name}`
          : ""
      }
      onChange={(e, signal) => {
        setSignal(signal);
      }}
      loading={loading}
      options={options}
      renderInput={params => (
        <TextField
          {...params}
          helperText="Required"
          label="Signal"
          variant="outlined"
        />
      )}
      value={signal || ""}
    />
  );
};

export default SignalComponentAutocomplete;
