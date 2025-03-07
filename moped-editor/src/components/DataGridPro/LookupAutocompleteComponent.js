import React, { useCallback } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import FullWidthPopper from "src/components/FullWidthPopper";
import { filterOptions } from "src/utils/autocompleteHelpers";

/**
 * Component for dropdown select using a lookup table as options
 * @param {Number} id - row id in Data Grid
 * @param {string} value - Field value
 * @param {string} field - name of Field
 * @param {Boolean} hasFocus - does field have focus in table
 * @param {String} name - name of lookup table relationship
 * @param {Array|Objects} options - the lookup table data
 * @param {Boolean} fullWidthPopper - should component use custom Popper component
 * @param {Object} autocompleteProps - props passed to the MUI Autocomplete Component
 * @param {Object} textFieldProps - props passed to the renderInput TextField
 * @param {string} dependentFieldName - optional, if another field should be updated on change, name of field
 * @param {function} dependentFieldValue - optional, takes newValue as input and returns the dependent fields change
 *
 * @returns {React component}
 */
const LookupAutocompleteComponent = ({
  id,
  value,
  field,
  hasFocus,
  name,
  options,
  fullWidthPopper,
  autocompleteProps,
  textFieldProps,
  dependentFieldName,
  dependentFieldValue,
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
    if (dependentFieldName) {
      apiRef.current.setEditCellValue({
        id,
        field: dependentFieldName,
        value: dependentFieldValue(newValue),
      });
    }
  };

  const defaultGetOptionLabel = useCallback(
    (option) => option[`${name}_name`],
    [name]
  );

  const defaultIsOptionEqualToValue = useCallback(
    (value, option) => value[`${name}_id`] === option[`${name}_id`],
    [name]
  );

  return (
    <Autocomplete
      sx={{ width: "100%", mx: 1, alignContent: "center" }}
      value={value?.[`${name}_id`] ? value : null}
      // use customized popper component so menu expands to fullwidth
      PopperComponent={fullWidthPopper && FullWidthPopper}
      id={name}
      filterOptions={filterOptions}
      options={options}
      renderInput={(params) => (
        <TextField
          variant="standard"
          {...params}
          inputRef={ref}
          {...textFieldProps}
        />
      )}
      {...autocompleteProps}
      getOptionLabel={
        autocompleteProps?.getOptionLabel
          ? autocompleteProps.getOptionLabel
          : defaultGetOptionLabel
      }
      isOptionEqualToValue={
        autocompleteProps?.isOptionEqualToValue
          ? autocompleteProps.isOptionEqualToValue
          : defaultIsOptionEqualToValue
      }
      onChange={handleChange}
    />
  );
};

export default LookupAutocompleteComponent;
