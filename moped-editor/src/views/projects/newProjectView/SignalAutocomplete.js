import React from "react";
import { CircularProgress } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import {
  signalToFeatureCollection,
  getSignalOptionLabel,
  getSignalOptionSelected,
  renderSignalInput,
  SOCRATA_ENDPOINT,
} from "src/utils/signalComponentHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";

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
      filterOptions={filterOptions}
      getOptionSelected={getSignalOptionSelected}
      getOptionLabel={getSignalOptionLabel}
      onChange={(e, signal) => {
        handleFieldChange(signal);
      }}
      loading={loading}
      options={features}
      renderInput={params => renderSignalInput(params, signalError)}
      value={signal || null}
    />
  );
};

export default SignalAutocomplete;
