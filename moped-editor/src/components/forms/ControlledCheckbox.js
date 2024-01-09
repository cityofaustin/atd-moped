import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Controller } from "react-hook-form";

/**
 * A react-hook-form wrapper of the MUI Checkbox component
 * @param {object} control - react-hook-form `control` object from useController - required
 * @param {string} name - unique field name which be used in react-hook-form data object
 * @param {string} label - the label to render next to the checkbox
 * @return {JSX.Element}
 */
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
