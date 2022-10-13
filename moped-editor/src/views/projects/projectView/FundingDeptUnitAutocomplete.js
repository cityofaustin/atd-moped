import React from "react";
import { CircularProgress, TextField } from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import { useSocrataJson } from "src/utils/socrataHelpers";
import { filterOptions } from "src/utils/autocompleteHelpers";

/*
* Transportation Project Financial Codes
*/
const SOCRATA_ENDPOINT =
  "https://data.austintexas.gov/resource/bgrt-2m2z.json?dept_unit_status=Active&$limit=9999";

const DeptUnitInput = (params, error = false, variant) => {
  return (
    <TextField
      {...params}
      error={error}
      InputLabelProps={{ required: false }}
      label="Dept-unit"
      variant={variant}
    />
  );
};

/**
 * Material Autocomplete wrapper that enables selecting a dept unit record from a
 * Socrata dataset and setting it.
 * * @param {Object} classes - MaterialUI style object
 * * @param {Object} props - passes down props parent MUI Table
 * * @param {Array} value - passes an array of objects, each representing a dept unit
 *  @return {JSX.Element}
 */
const FundingDeptUnitAutocomplete = ({ classes, props, value }) => {
  const { data, loading, error } = useSocrataJson(SOCRATA_ENDPOINT);

  const formatLabel = option => (
    !!option.dept ?
    `${option.dept} | ${option.unit} | ${option.unit_long_name} ` : ""
  )

  if (loading) {
    return <CircularProgress color="primary" size={20} />;
  } else if (error) {
    return (
      <Alert severity="error">{`Unable to load dept-units: ${error}`}</Alert>
    );
  }

  return (
    <Autocomplete
      className={classes}
      id="dept-unit-id"
      filterOptions={filterOptions}
      getOptionLabel={option => formatLabel(option)}
      onChange={(e, value) => props.onChange(value)}
      loading={loading}
      options={data}
      renderInput={params => DeptUnitInput(params, null, "standard")}
      value={value ?? null}
      getOptionSelected={(value, option) =>
        value.unit_long_name === option.unit_long_name
      }
    />
  );
};

export default FundingDeptUnitAutocomplete;
