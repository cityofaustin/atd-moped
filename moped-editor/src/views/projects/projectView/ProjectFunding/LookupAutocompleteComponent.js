import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import CustomPopper from "src/components/CustomPopper";

/**
 * Component for dropdown select using a lookup table as options
 * @param {Number} id - row id in Data Grid
 * @param {string} value - Field value
 * @param {string} field - name of Field
 * @param {Boolean} hasFocus - is field focused
 * @param {String} name - name of lookup table
 * @param {Array|Objects} lookupTable - the lookup table data
 * @param {Function}
 * @param {Function}
 * @returns {React component}
 */
const LookupAutocompleteComponent = ({
  id,
  value,
  field,
  hasFocus,
  name,
  lookupTable,
  getOptionLabel,
  isOptionEqualToValue,
  fullWidthPopper,
}) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleChange = (event, newValue) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });
  };

  const defaultGetOptionLabel = (option) => option[`${name}_name`];

  const defaultIsOptionEqualToValue = (value, option) =>
    value[`${name}_id`] === option[`${name}_id`];

  return (
    <Autocomplete
      sx={{ width: "100%", mx: 1, alignContent: "center" }}
      value={value?.[`${name}_id`] ? value : null}
      // use customized popper component so menu expands to fullwidth
      PopperComponent={fullWidthPopper && CustomPopper}
      id={name}
      options={lookupTable}
      renderInput={(params) => (
        <TextField variant="standard" {...params} inputRef={ref} />
      )}
      getOptionLabel={getOptionLabel ? getOptionLabel : defaultGetOptionLabel}
      isOptionEqualToValue={
        isOptionEqualToValue
          ? isOptionEqualToValue
          : defaultIsOptionEqualToValue
      }
      onChange={handleChange}
    />
  );
};

export default LookupAutocompleteComponent;
