import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const defaultOnChangeHandler = (value, field) => field.onChange(value || null);

const defaultValueHandler = (value) => value || "";

/**
 * A react-hook-form wrapper of the MUI TextField component
 * @return {JSX.Element}
 */
export default function ControlledTextInput({
  name,
  control,
  onChangeHandler = defaultOnChangeHandler,
  valueHandler = defaultValueHandler,
  ...inputProps
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <TextField
            {...field}
            {...inputProps}
            onChange={(e) => onChangeHandler(e.target.value, field)}
            value={valueHandler(field.value)}
          />
        );
      }}
    />
  );
}
