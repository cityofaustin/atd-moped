import React from "react";
import {
  Autocomplete,
  TextField,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

const TeamAutocompleteComponent = ({
  id,
  value,
  field,
  hasFocus,
  nameLookup,
  error,
  name,
}) => {
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

    const keyForValue = Object.keys(nameLookup).find(key => nameLookup[key] === value);

    if (option === keyForValue) {
      return true;
    } else {
      return false;
    }
  };

  const getOptionLabel = (option) => {
    if (typeof option === 'string' && !nameLookup[option]) {
      return option;
    }
    return nameLookup[option] || '';
  };

  return (
    <FormControl
      variant="standard"
      style={{ width: "100%", marginLeft: "10px", marginRight: "10px" }}
    >
      <Autocomplete
        id={name}
        name={name}
        options={options}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option, value) => isOptionEqualToValue(option, value)}
        value={value}
        sx={{ paddingTop: "8px" }}
        onChange={(event, newValue) => {
          handleChange(event, newValue);
        }}
        renderInput={(params) => (
          <TextField
            variant="standard"
            {...params}
            inputRef={ref}
            error={error}
          />
        )}
      />
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};

export default TeamAutocompleteComponent;
