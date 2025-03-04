import React from "react";
import { Autocomplete, TextField, FormControl } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import { useTheme } from "@mui/material/styles";

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
  name,
  milestoneNameLookup,
  error,
  relatedPhaseLookup,
  options,
}) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);
  const theme = useTheme();

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
      field: "moped_milestone_related_phase",
      value: { related_phase_id: newValue?.related_phase_id },
    });
  };

  console.log(value);

  return (
    <FormControl variant="standard" sx={{ width: "100%", mx: 1 }}>
      <Autocomplete
        id={"milestone_name"}
        name={"milestone_name"}
        options={options}
        getOptionLabel={(option) => option[`${name}_name`]}
        isOptionEqualToValue={(option, value) =>
          value[`${name}_id`] === option[`${name}_id`]
        }
        value={value}
        sx={{ paddingTop: theme.spacing(1) }}
        onChange={handleChange}
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

export default MilestoneAutocompleteComponent;
