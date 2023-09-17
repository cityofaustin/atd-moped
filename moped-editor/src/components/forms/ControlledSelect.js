import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";

/**
 *  A react-hook-form wrapper of the MUI Select component
 * @param {*} props
 * @returns {React component}
 */
const ControlledSelect = ({
  name,
  control,
  options,
  valueHandler,
  ...selectProps
}) => (
  <Controller
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
