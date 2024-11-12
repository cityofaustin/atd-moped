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
    console.log("event", event);
    console.log("newValue", newValue);
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue ?? null,  
    });
  };

  console.log(nameLookup);
  const options = Object.keys(nameLookup);

  const isOptionEqualToValue = (option, value) => {
    if (option === value) {
      return true;
    }
    
    if (nameLookup[option] === value) {
      return true;
    }
    
    if (String(option) === String(value)) {
      return true;
    }
    
    return false;
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
        onChange={handleChange}
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
