import React from "react";
import { Chip, CircularProgress } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useSocrataJson } from "src/utils/socrataHelpers";
import {
  TaskOrderInput,
  SOCRATA_ENDPOINT,
} from "src/utils/taskOrderComponentHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";

/**
 * Material Autocomplete wrapper that enables selecting a task order record from a
 * Socrata dataset and setting it.
 * * @param {Object} classes - MaterialUI style object
 * * @param {Object} props - passes down props parent MUI Table
 * * @param {Array} value - passes an array of objects, each representing a task order
 *  @return {JSX.Element}
 */
const TaskOrderAutocomplete = ({ classes, props, value }) => {
  const { data, loading, error } = useSocrataJson(SOCRATA_ENDPOINT);

  if (loading) {
    return <CircularProgress color="primary" size={20} />;
  } else if (error) {
    return (
      <Alert severity="error">{`Unable to load task order list: ${error}`}</Alert>
    );
  }

  return (
    <Autocomplete
      multiple
      className={classes}
      id="task-order-id"
      filterOptions={filterOptions}
      getOptionLabel={option => option.display_name}
      onChange={(e, value) => props.onChange(value)}
      loading={loading}
      options={data}
      renderInput={params => TaskOrderInput(params, null, "outlined")}
      value={value ?? []}
      getOptionSelected={(value, option) =>
        value.display_name === option.display_name
      }
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip label={option.display_name} {...getTagProps({ index })} />
        ))
      }
    />
  );
};

export default TaskOrderAutocomplete;
