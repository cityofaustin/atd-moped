import React from "react";
import { TextField } from "@material-ui/core";
import { handleKeyEvent } from "../../../utils/materialTableHelpers";

/**
 * DateFieldEditComponent - renders a Date type Calendar select
 * @param {object} props - Values passed through Material Table `editComponent`
 * @return {JSX.Element}
 * @constructor
 */

const DateFieldEditComponent = (props) => (
  <TextField
    name={props.name}
    label={props.label}
    type="date"
    variant="standard"
    value={props.value || ""}
    onChange={(e) => props.onChange(e.target.value)}
    onKeyDown={(e) => handleKeyEvent(e)}
    InputLabelProps={{
      shrink: true,
    }}
  />
);

export default DateFieldEditComponent;
