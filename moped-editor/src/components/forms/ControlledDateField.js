import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";

/**
 * A react-hook-form wrapper of the MUI DatePicker component
 * @param {object} control - react-hook-form `control` object from useController - required
 * @param {string} name - unique field name which be used in react-hook-form data object
 * @param {string} label - the label to render next to the checkbox
 * @return {JSX.Element}
 */
const ControlledDateField = ({ name, control, label }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        let value = field.value;
        if (value !== null && !isNaN(new Date(field.value))) {
          value = new Date(field.value);
        }
        return (
          <DatePicker
            size="small"
            label={label}
            slotProps={{
              textField: { size: "small" },
              field: {
                clearable: true,
              },
            }}
            value={value}
            onChange={(newValue) =>
              field.onChange(newValue ? newValue.toISOString() : newValue)
            }
          />
        );
      }}
    />
  );
};

export default ControlledDateField;
