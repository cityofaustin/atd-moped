import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Controller } from "react-hook-form";

const ControlledCheckbox = ({ name, control, label }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <FormControlLabel
            label={label}
            control={
              <Checkbox
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
          />
        );
      }}
    />
  );
};

export default ControlledCheckbox;
