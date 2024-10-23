import React from "react";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { parseISO, format } from "date-fns";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * DataGridDateFieldEdit - renders a Date type Calendar select for use in DataGrid
 * @param {object} props - Values passed through Material Table `editComponent`
 * @param {function} props.onChange - callback function to update the value
 * @param {string} props.value - the current value
 * @param {object} props.textFieldProps - additional props to pass to the picker's TextField
 * @return {JSX.Element}
 * @constructor
 */

const DataGridDateFieldEdit = ({
  onChange,
  value,
  hasFocus,
  id,
  field,
  ...props
}) => {
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
      ref={ref}
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
