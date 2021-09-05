import React from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { v4 as uuidv4 } from "uuid";
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
    const featureUUID = uuidv4();
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

/**
 * Material Autocomplete wrapper that enables selecting a traffic/phb signal record from a
 * Socrata dataset. Data is fetched once when the component mounts.
 * @param {Object} signal - A GeoJSON feature or a falsey object (e.g. "" from empty input)
 * * @param {func} setSignal - signal state setter
 * * @param {Object} projectDetails - The parent view's project details object
 * * @param {Object} setProjectDetails - The projectDetails state setter
 * * @param {Object} setFeatureCollection - The parent view's featureCollection state setter
 * * @param {Boolean} signalError - If the current signal value is in validation error
 *  @return {JSX.Element}
 */
const SignalAutocomplete = ({
  signal,
  setSignal,
  projectDetails,
  setProjectDetails,
  setFeatureCollection,
  signalError,
}) => {
  const handleFieldChange = signal => {
    const projectName = signal?.properties?.location_name || "";
    const updatedProjectDetails = {
      ...projectDetails,
      ...{ project_name: projectName },
    };
    setProjectDetails(updatedProjectDetails);
    setSignal(signal);
    const featureCollection = signalToFeatureCollection(signal);
    setFeatureCollection(featureCollection);
  };

  const { features, loading } = useSocrataGeojson(SOCRATA_ENDPOINT);

  const options = features ? [...features, ""] : [""]
  return (
    <Autocomplete
      id="signal-id"
      filterOptions={(options, { inputValue, getOptionLabel }) => {
        // limits options to ensure fast rendering
        const limit = 40;
        // applies the default autcomplete matching behavior plus our limit filter
        const filteredOptions = options.filter((option, i) =>
          getOptionLabel(option)
            .toLowerCase()
            .includes(inputValue.toLowerCase())
        );
        return filteredOptions.slice(0, limit);
      }}
      getOptionSelected={(option, value) => {
        // todo: i had to use optional chaning here, but i'm not sure why. the `value` test was
        // seemingly calling the first condition when value was ""
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
        handleFieldChange(signal);
      }}
      loading={loading}
      options={options}
      renderInput={params => (
        <TextField
          {...params}
          error={signalError}
          helperText="Required"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="primary" size={20} />
                ) : null}
              </>
            ),
          }}
          InputLabelProps={{ required: false }}
          label="Signal"
          required
          variant="standard"
        />
      )}
      value={signal}
    />
  );
};

export default SignalAutocomplete;
