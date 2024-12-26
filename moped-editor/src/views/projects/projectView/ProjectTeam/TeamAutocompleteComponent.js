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
  };

  const options = Object.keys(nameLookup);

  const isOptionEqualToValue = (option, value) => {
    // if the value is a number, use the idFromValue nameLookup to find if option is equal to Value
    // If the value is an object, use the user_id to find if option is equal to Value
    let idFromValue;
    if (typeof value === "string") {
      idFromValue = Object.keys(nameLookup).find(
        (key) => nameLookup[key] === value
      );
    } else if (typeof value === "object") {
      idFromValue = value.user_id;
    }

    if (Number(option) === Number(idFromValue)) {
      return true;
    } else {
      return false;
    }
  };

  const getOptionLabel = (option) => {
    if (typeof option === "string" && !nameLookup[option]) {
      return option;
    }
    return nameLookup[option] || "";
  };

  return (
    <FormControl
      variant="standard"
      sx={{ width: "100%", mx: theme.spacing(1) }}
    >
      <Autocomplete
        id={name}
        name={name}
        options={options}
        getOptionLabel={getOptionLabel}
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
