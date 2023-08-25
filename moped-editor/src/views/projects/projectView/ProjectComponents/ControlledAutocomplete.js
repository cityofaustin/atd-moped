import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const defaultOnChangeHandler = (option, field) => field.onChange(option);

const defaultIsOptionEqualToValue = (option, value) =>
  option?.value === value?.value;

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
  size = "small",
  disabled,
  helperText,
  error,
  onChangeHandler = defaultOnChangeHandler,
  isOptionEqualToValue = defaultIsOptionEqualToValue,
  valueHandler,
  filterOptions,
}) {
  return (
    <Controller
      id={id}
      name={name}
      control={control}
      render={({ field }) => {
        name === "task_orders" &&
          console.log("RFH task order value", field.value);
        return (
          <Autocomplete
            {...field}
            value={valueHandler ? valueHandler(field.value) : field.value}
            options={options}
            multiple={multiple}
            getOptionLabel={(option) => option?.label || ""}
            isOptionEqualToValue={isOptionEqualToValue}
            filterOptions={filterOptions || undefined}
            renderOption={renderOption}
            disabled={disabled}
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
            onChange={(_event, option) => onChangeHandler(option, field)}
          />
        );
      }}
    />
  );
}
