import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

/**
 * A react-hook-form wrapper of the MUI autocomplete component
 * @return {JSX.Element}
 */
export default function ControlledAutocomplete({
  id,
  options,
  renderOption,
  name,
  control,
  label,
  autoFocus = false,
  multiple = false,
  disabled,
  helperText,
  error,
}) {
  return (
    <Controller
      id={id}
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          options={options}
          multiple={multiple}
          getOptionLabel={(option) => option?.label || ""}
          isOptionEqualToValue={(option, value) =>
            option?.value === value?.value
          }
          renderOption={renderOption}
          disabled={disabled}
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={field.ref}
              size="small"
              label={label}
              variant="outlined"
              autoFocus={autoFocus}
              //   helperText={error ? error.message : helperText}
              helperText={helperText}
              error={error}
            />
          )}
          onChange={(_event, option) => field.onChange(option)}
        />
      )}
    />
  );
}
