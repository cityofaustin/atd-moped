import React from "react";
import { TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * @param {Integer} id - Data Grid row id
 * @param {String} value - field value
 * @param {String} field - name of field
 * @return {JSX.Element}
 */
const DataGridTextField = ({ id, value, field, hasFocus, helperText }) => {
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
    <TextField
      variant="standard"
      style={{ width: "inherit", paddingTop: "inherit" }}
      id={field}
      inputRef={ref}
      name={field}
      type="text"
      value={value ?? ""}
      onChange={handleChange}
      helperText={!!helperText && helperText}
    />
  );
};

export default DataGridTextField;
