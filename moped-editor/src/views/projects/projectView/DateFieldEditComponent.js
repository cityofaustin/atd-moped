import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { parseISO, format } from "date-fns";

/**
 * DateFieldEditComponent - renders a Date type Calendar select
 * @param {object} props - Values passed through Material Table `editComponent`
 * @return {JSX.Element}
 * @constructor
 */

const DateFieldEditComponent = (props) => {
  const handleDateChange = (date) => {
    const newDate = date ? format(date, "yyyy-MM-dd") : null;
    props.onChange(newDate);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        clearable={true}
        emptyLabel="mm/dd/yyyy"
        format="MM/dd/yyyy"
        value={props.value ? parseISO(props.value) : null}
        onChange={handleDateChange}
        InputProps={{ style: { minWidth: "100px" } }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateFieldEditComponent;
