import React from "react";
import { Grid, Switch } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * ToggleEditComponent - renders a toggle for True/False edit fields in DataGrid
 * @param {object} props -
 * @return {JSX.Element}
 * @constructor
 */
const ToggleEditComponent = ({ id, value, field, hasFocus, name }) => {
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
          name={name}
          inputProps={{ "aria-label": "primary checkbox" }}
          inputRef={ref}
        />
      </Grid>
    </Grid>
  );
};

export default ToggleEditComponent;
