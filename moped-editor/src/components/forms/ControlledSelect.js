import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";

/**
 * Defines the callback handler for when a field value changes. This function keeps
 * react-hook-form state in sync with the field input state. Since this is the default
 * handler, it merely saves the exact value(s) selected into react-hook-form state
 * @param {any} the value of the selected option
 * @param {any} the value of the selected menu option
 * @param {*} field the react-hook-form field object
 * @returns undefined
 */
const defaultOnChangeHandler = (value, field) => field.onChange(value);

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
  onChangeHandler = defaultOnChangeHandler,
  ...selectProps
}) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => {
      return (
        <Select
          value={valueHandler ? valueHandler(field.value) : field.value}
          onChange={(e) => onChangeHandler(e.target.value, field)}
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
