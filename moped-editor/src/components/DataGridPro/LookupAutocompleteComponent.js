import React from "react";
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
 * @param {Object} autocompleteProps - props passed to the MUI Autcomplete Component
 * @param {Boolean} fullWidthPopper - should component use custom Popper component
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
      PopperComponent={fullWidthPopper && FullWidthPopper}
      id={name}
      filterOptions={filterOptions}
      options={options}
      renderInput={(params) => (
        <TextField variant="standard" {...params} inputRef={ref} />
      )}
      {...autocompleteProps}
      getOptionLabel={
        autocompleteProps.getOptionLabel
          ? autocompleteProps.getOptionLabel
          : defaultGetOptionLabel
      }
      isOptionEqualToValue={
        autocompleteProps.isOptionEqualToValue
          ? autocompleteProps.isOptionEqualToValue
          : defaultIsOptionEqualToValue
      }
      onChange={handleChange}
    />
  );
};

export default LookupAutocompleteComponent;
