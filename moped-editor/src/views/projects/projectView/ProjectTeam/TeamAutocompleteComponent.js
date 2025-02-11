import React from "react";
import { Autocomplete, TextField, FormControl } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import { useTheme } from "@mui/material/styles";

/**
 * @param {Integer} id - Data Grid row id (same as record id)
 * @param {String} value - field value
 * @param {String} field - name of field
 * @param {Boolean} hasFocus - does this field have focus
 * @param {Object} nameLookup - maps user id to user name
 * @param {Boolean} error - toggles error style in textfield
 * @param {Object} name - name of the field
 * @param {Object} userWorkgroupLookup - mapping of user ids to their corresponding workgroup ids
 * @return {JSX.Element}
 */
const TeamAutocompleteComponent = ({
  id,
  value,
  field,
  hasFocus,
  nameLookup,
  error,
  name,
  userWorkgroupLookup,
  options,
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
    const personnelValue = nameLookup[newValue];
    apiRef.current.setEditCellValue({
      id,
      field,
      value: personnelValue ?? null,
    });
    // Also update the corresponding workgroup field with the selected user's workgroup id
    apiRef.current.setEditCellValue({
      id,
      field: "moped_workgroup",
      value: { workgroup_id: userWorkgroupLookup[newValue] },
    });
  };

  const isOptionEqualToValue = (option, value) => {
    // if 
    return value?.user_id === option?.user_id;
  };

  const getOptionLabel = (option) => {
    return option.user_id ? `${option.first_name} ${option.last_name}` : "";
  };

  return (
    <FormControl variant="standard" sx={{ width: "100%", mx: 1 }}>
      <Autocomplete
        id={name}
        name={name}
        options={options}
        getOptionLabel={getOptionLabel}
        getOptionKey={(option) => option.user_id}
        isOptionEqualToValue={(option, value) =>
          isOptionEqualToValue(option, value)
        }
        value={value || null}
        sx={{ paddingTop: theme.spacing(1) }}
        onChange={(event, newValue) => {
          handleChange(event, newValue);
        }}
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            inputRef={ref}
            error={error}
            helperText="Required"
          />
        )}
      />
    </FormControl>
  );
};

export default TeamAutocompleteComponent;
