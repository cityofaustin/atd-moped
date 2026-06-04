import React from "react";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { parseISO, format } from "date-fns";

/**
 * DateFieldEditComponent - renders a Date type Calendar select
 * @param {object} props - Values passed through Material Table `editComponent`
 * @param {function} props.onChange - callback function to update the value
 * @param {string} props.value - the current value
 * @param {object} props.textFieldProps - additional props to pass to the picker's TextField
 * @return {JSX.Element}
 * @constructor
 */

const DateFieldEditComponent = React.forwardRef(
  ({ onChange, value, textFieldProps, ...props }, ref) => {
    const handleDateChange = (date) => {
      const newDate = date ? format(date, "yyyy-MM-dd") : null;
      onChange(newDate);
    };

    return (
      <MobileDatePicker
        ref={ref}
        format="MM/dd/yyyy"
        value={value ? parseISO(value) : null}
        onChange={handleDateChange}
        InputProps={{ style: { minWidth: "100px" } }}
        slotProps={{
          actionBar: { actions: ["accept", "cancel", "clear"] },
          textField: textFieldProps,
        }}
        {...props}
      />
    );
  }
);

export default DateFieldEditComponent;
