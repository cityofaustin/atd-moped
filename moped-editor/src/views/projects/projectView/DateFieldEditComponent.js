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
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        clearable={true}
        emptyLabel="mm/dd/yyyy"
        format="MM/dd/yyyy"
        value={props.value ? parseISO(props.value) : null}
        onChange={(e) => {
          const newDate = e ? format(e, "yyyy-MM-dd") : null;
          props.onChange(newDate);
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateFieldEditComponent;
