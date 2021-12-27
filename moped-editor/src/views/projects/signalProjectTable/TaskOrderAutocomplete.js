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
 * Material Autocomplete wrapper that enables selecting a task order record from a
 * Socrata dataset and setting it.
 * * @param {Object} classes - MaterialUI style object
 * * @param {Object} props - passes down props parent MUI Table
 *  @return {JSX.Element}
 */
const TaskOrderAutocomplete = ({ classes, props, setTaskOrder }) => {
  const taskOrder = null;
  const { data, loading, error } = useSocrataJson(SOCRATA_ENDPOINT);

  if (loading) {
    return <CircularProgress color="primary" size={20} />;
  } else if (error) {
    return (
      <Alert severity="error">{`Unable to load task order list: ${error}`}</Alert>
    );
  }

  console.log(data);
  return (
    <Autocomplete
      multiple
      className={classes}
      id="signal-id"
      filterOptions={filterOptions}
      // getOptionSelected={getSignalOptionSelected}
      getOptionLabel={option => option.display_name}
      onChange={(e, value) => {
        console.log("change will happen here");
        console.log(e, value);
        props.onChange(value);
      }}
      loading={loading}
      options={data}
      renderInput={params => TaskOrderInput(params, null, "outlined")}
      defaultValue={[]}
    />
  );
};

export default TaskOrderAutocomplete;
