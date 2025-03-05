import React, { useCallback } from "react";
import {
  Autocomplete,
  TextField,
  FormControl
} from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import { useTheme } from "@mui/material/styles";

/**
 * @param {Integer} id - Data Grid row id (same as record id)
 * @param {String} value - field value
 * @param {String} field - name of field
 * @param {Boolean} hasFocus - does this field have focus
 * @param {Boolean} error - toggles error style in textfield
 * @param {Object} name - name of the field
 * @param {Object} options - moped users to use in team member select
 * @param {Object} workgroupLookup - lookup object to map workgroup ids to names
 * @return {JSX.Element}
 */
const AutcompleteWithDependentField = ({
  id,
  value,
  field,
  hasFocus,
  name,
  options,
  autocompleteProps,
  textFieldProps,
  dependentFieldName,
  dependentFieldValue,
}) => {
  const theme = useTheme();
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
    // Also update the corresponding workgroup field with the selected user's workgroup id
    apiRef.current.setEditCellValue({
      id,
      field: dependentFieldName,
      value: dependentFieldValue(newValue),
    });
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
    <FormControl variant="standard" sx={{ width: "100%", mx: 1 }}>
      <Autocomplete
        sx={{ paddingTop: theme.spacing(1) }}
        id={name}
        name={name}
        options={options}
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
        value={value?.user_id ? value : null}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            inputRef={ref}
            {...textFieldProps}
          />
        )}
      />
    </FormControl>
  );
};

export default AutcompleteWithDependentField;
