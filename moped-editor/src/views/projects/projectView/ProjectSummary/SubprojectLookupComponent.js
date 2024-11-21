import React, { useEffect, useRef } from "react";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

/** Component for subproject lookup dropdown
 * @param {Integer} id - Data Grid row id (same as project id)
 * @param {String} value - field value
 * @param {String} field - name of field
 * @param {Boolean} hasFocus - does this field have focus
 * @param {Object} data - data object with subproject options
 * @return {JSX.Element}
 */

const SubprojectLookupComponent = ({ id, value, field, hasFocus, data }) => {
  const apiRef = useGridApiContext();
  const ref = useRef(null);

  useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleChange = (event, newValue) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      // this will be an object containing the project id, name, and status for the project selected
      value: newValue ? newValue : null,
    });
  };

  return (
    <FormControl variant="standard" style={{ width: "100%" }}>
      <Autocomplete
        id="project_name"
        name="project_name"
        options={data?.subprojectOptions}
        getOptionLabel={(option) =>
          `${option.project_id} - ${option.project_name_full}`
        }
        value={value || null}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField variant="standard" {...params} inputRef={ref} />
        )}
      />
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};

export default SubprojectLookupComponent;
