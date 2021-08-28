import React from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { v4 as uuidv4 } from "uuid";

const signalToFeatureCollection = signal => {
  // Immitate a "drawn point" feature from a traffic signal feature
  // If no signal, returns featureCollection with no features (resets fc state)
  let featureCollection = {
    type: "FeatureCollection",
    features: [],
  };

  if (signal) {
    const featureUUID = uuidv4();
    // todo: actually store the traffic signal ID somewhere
    // probably as new component attributes "asset_id" and "asset_type"
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

const SignalAutocomplete = ({
  signal,
  setSignal,
  projectDetails,
  setProjectDetails,
  setFeatureCollection,
  nameError,
}) => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleFieldChange = signal => {
    const projectName = signal?.properties.location_name || "";
    const updatedProjectDetails = {
      ...projectDetails,
      ...{ project_name: projectName },
    };
    setProjectDetails(updatedProjectDetails);
    setSignal(signal);
    const featureCollection = signalToFeatureCollection(signal);
    setFeatureCollection(featureCollection);
  };

  React.useEffect(() => {
    const url =
      "https://data.austintexas.gov/resource/p53x-x73x.geojson?$select=signal_id,location_name,location,signal_type&$order=signal_id asc&$limit=9999";
    fetch(url)
      .then(response => response.json())
      .then(
        result => {
          if (result.error) {
            // on query error, socrata returns status 200 with {"error": true, "message": <message>} in body
            setError(result.message.toString());
          } else {
            // remember: socrata geojson request returns a featureCollection
            result.features.unshift("");
            setData(result.features);
          }
        },
        error => {
          setError(error.toString());
        }
      );
  }, []);

  return (
    <Autocomplete
      id="signal-id"
      options={data || []}
      loading={!data && !error}
      value={signal}
      onChange={(e, signal) => {
        handleFieldChange(signal);
      }}
      // func to match the value from props to the selected option we should display
      getOptionSelected={(option, value) => {
        // todo: i had to use optional chaning here, but i'm not sure why. the `value` test was
        // seemingly calling the first condition when value was ""
        return value
          ? option.properties?.signal_id === value.properties?.signal_id
          : option === "";
      }}
      getOptionLabel={option =>
        option
          ? `${option.properties.signal_id}: ${option.properties.location_name}`
          : ""
      }
      renderInput={params => (
        <TextField
          {...params}
          label="Signal"
          variant="standard"
          helperText="Required"
          InputLabelProps={{ required: false }}
          required
          error={nameError}
        />
      )}
    />
  );
};

export default SignalAutocomplete;
