import React from "react";
import {
  Autocomplete,
  TextField,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * @param {Integer} id - Data Grid row id (same as record id)
 * @param {String} value - field value
 * @param {String} field - name of field
 * @param {Boolean} hasFocus - does this field have focus
 * @param {Boolean} error - toggles error style in textfield
 * @param {Object} milestoneNameLookup - maps milestone id to milestone name
 * @param {Object} relatedPhaseLookup - maps milestone id to related phase id
 * @return {JSX.Element}
 */
const MilestoneAutocompleteComponent = ({
  id,
  value,
  field,
  hasFocus,
  milestoneNameLookup,
  error,
  relatedPhaseLookup,
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
      value: newValue ?? null,
    });
    // Also update the moped_milestone field aka the Related Phase
    apiRef.current.setEditCellValue({
      id,
      field: "moped_milestone",
      value: { related_phase_id: relatedPhaseLookup[newValue] },
    });
  };

  return (
    <FormControl
      variant="standard"
      style={{ width: "100%", marginLeft: "10px", marginRight: "10px" }}
    >
      <Autocomplete
        id={"milestone_name"}
        name={"milestone_name"}
        options={Object.keys(milestoneNameLookup)}
        getOptionLabel={(option) => milestoneNameLookup[option]}
        isOptionEqualToValue={(option, value) => option === String(value)}
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

export default MilestoneAutocompleteComponent;
