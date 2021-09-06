import React from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useSocrataGeojson } from "src/utils/socrataHelpers";

const SOCRATA_ENDPOINT =
  "https://data.austintexas.gov/resource/p53x-x73x.geojson?$select=signal_id,location_name,location,signal_type&$order=signal_id asc&$limit=9999";

/**
 * Immitate a "drawn point" feature from a traffic signal goejosn feature. Sets required
 * fields so that featureCollection can be used in the DB mutation on submit
 * @param {Object} signal - A GeoJSON feature or a falsey object (e.g. "" from empty input)
 * @return {Object} A geojson feature collection with the signal feature or 0 features
 */
const signalToFeatureCollection = signal => {
  let featureCollection = {
    type: "FeatureCollection",
    features: [],
  };
  if (signal) {
    /* 
    / preserves the feature's previous UUID if it's being edited. we are **not** preserving
    / any other feature properties when the feature is edited. so, for example, if the user
    / edits a signal component and the signal geometry in socrata has since changed, the new
    / geometry will be saved.
    */
    const featureUUID = signal.id || uuidv4();
    const feature = {
      type: "Feature",
      properties: {
        ...signal.properties,
        renderType: "Point",
        PROJECT_EXTENT_ID: featureUUID,
        sourceLayer: "drawnByUser",
      },
      geometry: signal.geometry,
      id: featureUUID,
    };
    featureCollection.features.push(feature);
  }
  return featureCollection;
};

const useInitialComponentValue = (editFeatureCollection, setSignal) => {
  // initializes the selected signal value - handles case of editing existing component
  // tests for signal_id prop to ensure we're not handing a non-signal component (which happens e.g. when an existing
  // component's type is changed)
  useEffect(() => {
    if (
      !editFeatureCollection ||
      editFeatureCollection.features.length === 0 ||
      !editFeatureCollection.features[0].properties.signal_id
    ) {
      setSignal("");
      return;
    } else if (editFeatureCollection.features.length > 1) {
      // todo: prevent this from happening by locking down map editing for signal components :/
      console.warn(
        "Found signal component with multiple feature geometriess—all but one feature will be removed."
      );
    }
    setSignal(editFeatureCollection.features[0]);
    // only fire on init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

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
        const filteredOptions = options.filter(
          (option, i) =>
            getOptionLabel(option)
              .toLowerCase()
              .includes(inputValue.toLowerCase()) && i < limit
        );
        return filteredOptions;
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
