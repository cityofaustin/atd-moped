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
 * @param {Array<Object>} options - the lookup table data
 * @param {Boolean} fullWidthPopper - should component use custom Popper component
 * @param {Object} autocompleteProps - props passed to the MUI Autocomplete Component
 * @param {Object} textFieldProps - props passed to the renderInput TextField
 * @param {Array<Object>} dependentFieldsArray - optional, array of objects {fieldName: String, setFieldValue: function
 * that takes newValue as input and returns the dependent fields change}
 * @param {function} refetch - optional, function to refetch lookup table data when dropdown is opened
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
  dependentFieldsArray,
  refetch,
}) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  React.useEffect(() => {
    // only refetch when when component has been passed a refetch function
    if (open && typeof refetch === "function") {
      refetch();
    }
  }, [open, refetch]);

  const handleChange = (event, newValue) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });

    if (dependentFieldsArray && dependentFieldsArray.length > 0) {
      dependentFieldsArray.forEach((field) => {
        apiRef.current.setEditCellValue({
          id,
          field: field.fieldName,
          value: field.setFieldValue(newValue),
        });
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
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
    />
  );
};

export default LookupAutocompleteComponent;
