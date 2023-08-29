import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

// const defaultIsOptionEqualToValue = (option, value) =>
//   option?.value === value?.value;

/**
 * A react-hook-form wrapper of the MUI autocomplete component
 * @return {JSX.Element}
 */
export default function ControlledTextInput({ name, control, ...inputProps }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        console.log("FIELD", field.value);
        return (
          <TextField
            {...field}
            {...inputProps}
            onChange={(e) => field.onChange(e.target.value || null)}
            value={field.value || ""}
          />
        );
      }}
    />
  );
}
