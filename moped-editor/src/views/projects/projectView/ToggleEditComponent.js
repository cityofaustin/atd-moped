import React from "react";
import { Grid, Switch } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * ToggleEditComponent - renders a toggle for True/False edit fields in DataGrid
 * @param {string} value - the current value
 * @param {Integer} id - Data Grid row id
 * @param {String} field - name of field
 * @param {Boolean} hasFocus - does this field have focus
 * @return {JSX.Element}
 * @constructor
 */
const ToggleEditComponent = ({ id, value, field, hasFocus }) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleChange = (event, newValue) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue ?? null,
    });
  };

  return (
    <Grid component="label" container alignItems="center" spacing={1}>
      <Grid item>
        <Switch
          checked={value ?? false}
          onChange={handleChange}
          color="primary"
          name={field}
          inputProps={{ "aria-label": "primary checkbox" }}
          inputRef={ref}
        />
      </Grid>
    </Grid>
  );
};

export default ToggleEditComponent;
