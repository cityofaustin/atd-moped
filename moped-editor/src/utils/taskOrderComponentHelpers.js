import React from "react";
import { TextField } from "@material-ui/core";

/*
 * Socrata Endpoint
 */
export const SOCRATA_ENDPOINT =
  "https://data.austintexas.gov/resource/ggav-ufvc.json?$limit=9999";

/*
/ Defines text input to render in MUI autocomplete
*/
export const TaskOrderInput = (params, error = false, variant = "standard") => {
  return (
    <TextField
      {...params}
      error={error}
      InputLabelProps={{ required: false }}
      label="Task order"
      variant={variant}
    />
  );
};
