import { MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";

/**
 * Component for dropdown select using a lookup table as options
 * @param {*} props
 * @returns {React component}
 */
const ControlledSelect = ({
  id,
  name,
  control,
  options,
  valueHandler,
  ...selectProps
}) => (
  <Controller
    id={id}
    name={name}
    control={control}
    render={({ field }) => {
      return (
        <Select
          value={field.value || ""}
          onChange={(e) => field.onChange(e.target.value)}
          {...selectProps}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      );
    }}
  />
);

export default ControlledSelect;
