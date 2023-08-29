import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const defaultOnChangeHandler = (option, field) => field.onChange(option);

/**
 * A react-hook-form wrapper of the MUI autocomplete component
 * @return {JSX.Element}
 */
export default function ControlledAutocomplete({
  id,
  options,
  name,
  control,
  label,
  autoFocus = false,
  helperText,
  size = "small",
  error,
  onChangeHandler = defaultOnChangeHandler,
  valueHandler,
  ...autoCompleteProps
}) {
  return (
    <Controller
      id={id}
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <Autocomplete
            {...field}
            onChange={(_event, option) => onChangeHandler(option, field)}
            options={options}
            value={valueHandler ? valueHandler(field.value) : field.value}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={field.ref}
                size={size}
                label={label}
                variant="outlined"
                autoFocus={autoFocus}
                helperText={helperText}
                error={error}
              />
            )}
            {...autoCompleteProps}
          />
        );
      }}
    />
  );
}
