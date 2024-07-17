import React from "react";
import { TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * MUI TextField wrapper that limits input to 0-9 for project funding amount
 * and handles editors pasting a number with a decimal Ex. $86,753.09 -> 86753
 * @param {Integer} id - Data Grid row id
 * @param {String} value - field value
 * @param {String} field - name of field
 * @return {JSX.Element}
 */
const DataGridTextField = ({ id, value, field }) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

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
      ref={ref}
      name={field}
      type="text"
      value={value ?? ""}
      onChange={handleChange}
    />
  );
};

export default DataGridTextField;
