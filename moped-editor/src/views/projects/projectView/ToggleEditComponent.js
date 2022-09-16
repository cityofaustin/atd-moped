import React from "react";
import { Grid, Switch } from "@material-ui/core";
import { handleKeyEvent } from "../../../utils/materialTableHelpers";

/**
 * ToggleEditComponent - renders a toggle for True/False edit fields
 * @param {object} props - Values passed through Material Table `editComponent`
 * @return {JSX.Element}
 * @constructor
 */
const ToggleEditComponent = (props) => (
  <Grid component="label" container alignItems="center" spacing={1}>
    <Grid item>
      <Switch
        checked={props.value ?? false}
        onChange={(e) => props.onChange(!props.value)}
        color="primary"
        name={props.name}
        inputProps={{ "aria-label": "primary checkbox" }}
        onKeyDown={(e) => handleKeyEvent(e)}
      />
    </Grid>
  </Grid>
);

export default ToggleEditComponent;
