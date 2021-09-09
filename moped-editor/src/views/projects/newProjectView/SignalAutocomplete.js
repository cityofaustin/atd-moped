import React from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import {
  signalToFeatureCollection,
  getSignalOptionLabel,
  getSignalOptionSelected,
} from "src/utils/signalComponentHelpers";

const SOCRATA_ENDPOINT =
  "https://data.austintexas.gov/resource/p53x-x73x.geojson?$select=signal_id,location_name,location,signal_type&$order=signal_id asc&$limit=9999";

/**
 * Material Autocomplete wrapper that enables selecting a traffic/phb signal record from a
 * Socrata dataset. Data is fetched once when the component mounts.
 * @param {Object} signal - A GeoJSON feature or a falsey object (e.g. "" from empty input)
 * @param {func} setSignal - signal state setter
 * @param {Object} projectDetails - The parent view's project details object
 * @param {Object} setProjectDetails - The projectDetails state setter
 * @param {Object} setFeatureCollection - The parent view's featureCollection state setter
 * @param {Boolean} signalError - If the current signal value is in validation error
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

  const { features, loading, error } = useSocrataGeojson(SOCRATA_ENDPOINT);

  if (loading) {
    // we don't want to render the autocomplete without options, because getOptionSelected
    // will error if we're editing an existing component
    return <CircularProgress color="primary" size={20} />;
  } else if (error) {
    return (
      <Alert severity="error">{`Unable to load signal list: ${error}`}</Alert>
    );
  }

  return (
    <Autocomplete
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
      getOptionSelected={getSignalOptionSelected}
      getOptionLabel={getSignalOptionLabel}
      onChange={(e, signal) => {
        handleFieldChange(signal);
      }}
      loading={loading}
      options={features}
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
      value={signal || null}
    />
  );
};

export default SignalAutocomplete;
