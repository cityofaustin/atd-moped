import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";

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
