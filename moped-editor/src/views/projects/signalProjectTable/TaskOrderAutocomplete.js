import React from "react";
import { useState } from "react";
import { CircularProgress } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useSocrataJson } from "src/utils/socrataHelpers";
import {
  // useSignalChangeEffect,
  // getSignalOptionLabel,
  // getSignalOptionSelected,
  // useInitialSignalComponentValue,
  // renderSignalInput,
  TaskOrderInput,
  SOCRATA_ENDPOINT,
} from "src/utils/taskOrderComponentHelpers";
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
const TaskOrderAutocomplete = ({
  classes,
  // setSelectedComponentSubtype,
  // setEditFeatureCollection,
  // editFeatureCollection,
}) => {
  const [signal, setSignal] = useState(null);
  const { data, loading, error } = useSocrataJson(SOCRATA_ENDPOINT);

  console.log(data);

  // useInitialSignalComponentValue(editFeatureCollection, setSignal);

  // useSignalChangeEffect(
  //   signal,
  //   setSelectedComponentSubtype,
  //   setEditFeatureCollection
  // );

  if (loading) {
    return <CircularProgress color="primary" size={20} />;
  } else if (error) {
    return (
      <Alert severity="error">{`Unable to load task order list: ${error}`}</Alert>
    );
  }

  return (
    <Autocomplete
      className={classes}
      id="signal-id"
      filterOptions={filterOptions}
      // getOptionSelected={getSignalOptionSelected}
      getOptionLabel={option => option.display_name}
      onChange={(e, signal) => {
        // setSignal(signal ? signal : null);
      }}
      loading={loading}
      options={data}
      renderInput={params => TaskOrderInput(params, null, "outlined")}
      value={signal || null}
    />
  );
};

export default TaskOrderAutocomplete;
