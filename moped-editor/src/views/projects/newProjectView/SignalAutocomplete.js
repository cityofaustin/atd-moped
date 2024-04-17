import React from "react";
import { CircularProgress } from "@mui/material";
import { Autocomplete, Alert } from "@mui/material";
import { useSocrataGeojson } from "src/utils/socrataHelpers";
import {
  knackSignalRecordToFeatureSignalsRecord,
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
 * @param {Object} setSignalRecord - The parent view's signal record state setter
 * @param {Boolean} signalError - If the current signal value is in validation error
 *  @return {JSX.Element}
 */
const SignalAutocomplete = ({
  signal,
  setSignal,
  projectDetails,
  setProjectDetails,
  setSignalRecord,
  signalError,
}) => {
  const handleFieldChange = (signal) => {
    const projectName = signal?.properties?.location_name || "";
    const updatedProjectDetails = {
      ...projectDetails,
      ...{ project_name: projectName },
    };
    setProjectDetails(updatedProjectDetails);
    setSignal(signal);
    const signalRecord = knackSignalRecordToFeatureSignalsRecord(signal);
    setSignalRecord(signalRecord);
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
      isOptionEqualToValue={getSignalOptionSelected}
      getOptionLabel={getSignalOptionLabel}
      onChange={(e, signal) => {
        handleFieldChange(signal);
      }}
      loading={loading}
      options={features}
      renderInput={(params) => renderSignalInput(params, signalError)}
      value={signal || null}
    />
  );
};

export default SignalAutocomplete;
