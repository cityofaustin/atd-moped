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
 * @returns {React component}
 */
const LookupAutocompleteComponent = ({
  id,
  value,
  field,
  hasFocus,
  name,
  lookupTable,
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

  return (
    <Autocomplete
      sx={{ width: "100%", mx: 1 }}
      value={value?.[`${name}_id`] ? value : null}
      // use customized popper component so menu expands to fullwidth
      PopperComponent={CustomPopper}
      id={name}
      options={lookupTable}
      renderInput={(params) => (
        <TextField variant="standard" {...params} inputRef={ref} />
      )}
      getOptionLabel={(option) => option[`${name}_name`]}
      isOptionEqualToValue={(value, option) =>
        value[`${name}_id`] === option[`${name}_id`]
      }
      onChange={handleChange}
    />
  );
};

export default LookupAutocompleteComponent;
