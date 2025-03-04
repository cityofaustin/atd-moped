import React from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  ListItem,
  ListItemText,
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
 * @return {JSX.Element}
 */
const TeamAutocompleteComponent = ({
  id,
  value,
  field,
  hasFocus,
  error,
  name,
  options,
  workgroupLookup,
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
      field: "moped_workgroup",
      value: {
        workgroup_id: newValue?.workgroup_id,
        workgroup_name: workgroupLookup[newValue?.workgroup_id],
      },
    });
  };

  const isOptionEqualToValue = (option, value) => {
    return value?.user_id === option?.user_id;
  };

  const getOptionLabel = (option) => {
    return option.user_id ? `${option.first_name} ${option.last_name}` : "";
  };

  const renderOption = (props, option) => {
    return (
      <ListItem {...props} key={option.user_id}>
        <ListItemText
          primary={`${option.first_name} ${option.last_name}`}
          secondary={option.email}
        />
      </ListItem>
    );
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
        renderOption={renderOption}
        value={value?.user_id ? value : null}
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
