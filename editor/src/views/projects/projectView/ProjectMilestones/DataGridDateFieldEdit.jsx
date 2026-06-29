import React from "react";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { parseISO, format } from "date-fns";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * DataGridDateFieldEdit - renders a Date type Calendar select for use in DataGrid
 * @param {string} value - the current value
 * @param {Integer} id - Data Grid row id
 * @param {String} field - name of field
 * @param {Boolean} hasFocus - does this field have focus
 * @return {JSX.Element}
 * @constructor
 */
const DataGridDateFieldEdit = ({ value, hasFocus, id, field, ...props }) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleChange = (newValue) => {
    const newDate = newValue ? format(newValue, "yyyy-MM-dd") : null;
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newDate,
    });
  };

  return (
    <MobileDatePicker
      sx={{ mx: 1 }}
      inputRef={ref}
      format="MM/dd/yyyy"
      value={value ? parseISO(value) : null}
      onChange={handleChange}
      InputProps={{ style: { minWidth: "100px" } }}
      slotProps={{
        actionBar: { actions: ["accept", "cancel", "clear"] },
      }}
      {...props}
    />
  );
};

export default DataGridDateFieldEdit;
