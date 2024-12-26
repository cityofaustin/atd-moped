import React from "react";
import { FormControl, Select, MenuItem, FormHelperText } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * @param {Integer} id - Data Grid row id
 * @param {String} value - field value
 * @param {String} field - name of field
 * @param {Boolean} hasFocus - does this field have focus
 * @return {JSX.Element}
 */
const ProjectFilesTypeSelect = ({ id, value, field, hasFocus }) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleChange = (event, newValue) => {
    const { value: inputValue } = event.target;

    apiRef.current.setEditCellValue({
      id,
      field,
      value: inputValue,
    });
  };

  return (
    <FormControl variant="standard" sx={{ width: "100%", mx: 1 }}>
      <Select
        variant="standard"
        id={field}
        inputRef={ref}
        name={field}
        value={value}
        onChange={handleChange}
      >
        <MenuItem value={1}>Funding</MenuItem>
        <MenuItem value={2}>Plans</MenuItem>
        <MenuItem value={3}>Estimates</MenuItem>
        <MenuItem value={4}>Other</MenuItem>
      </Select>
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};

export default ProjectFilesTypeSelect;
