import React from "react";
import { TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * @param {Integer} id - Data Grid row id
 * @param {String} value - field value
 * @param {String} field - name of field
 * @param {Boolean} hasFocus - does this field have focus
 * @param {String} helperText - optional helper text
 * @param {Boolean} error - toggles error style in textfield
 * @return {JSX.Element}
 */
const DataGridTextField = ({
  id,
  value,
  field,
  hasFocus,
  helperText,
  error,
  multiline = false,
}) => {
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
      sx={{ width: "100%", mx: 1 }}
      id={field}
      inputRef={ref}
      name={field}
      type="text"
      value={value ?? ""}
      onChange={handleChange}
      helperText={!!helperText && helperText}
      error={error}
      multiline={multiline}
    />
  );
};

export default DataGridTextField;
