import React from "react";
import { FormControl, Select, MenuItem, FormHelperText } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * @param {Integer} id - Data Grid row id
 * @param {String} value - field value
 * @param {String} field - name of field
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
    <FormControl variant="standard" sx={{ paddingTop: "8px" }}>
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

    // <TextField
    //   variant="standard"
    //   style={{ width: "inherit", paddingTop: "inherit" }}
    //   id={field}
    //   inputRef={ref}
    //   name={field}
    //   type="text"
    //   value={value ?? ""}
    //   onChange={handleChange}
    //   helperText={!!helperText && helperText}
    //   error={error}
    // />
  );
};

export default ProjectFilesTypeSelect;
