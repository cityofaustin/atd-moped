import React from "react";
import { TextField } from "@material-ui/core";
import { handleKeyEvent } from "../../../utils/materialTableHelpers";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { useState } from "react";
import { set } from "date-fns";
import { ConsoleLogger } from "@aws-amplify/core";
import { parseISO } from "date-fns";

/**
 * DateFieldEditComponent - renders a Date type Calendar select
 * @param {object} props - Values passed through Material Table `editComponent`
 * @return {JSX.Element}
 * @constructor
 */

// const DateFieldEditComponent = (props) => (
//   <TextField
//     type="date"
//     variant="standard"
//     value={props.value || ""}
//     onChange={(e) => props.onChange(e.target.value)}
//     onKeyDown={(e) => handleKeyEvent(e)}
//     InputLabelProps={{
//       shrink: true,
//     }}
//   />
// );

const DateFieldEditComponent = (props) => {

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        clearable={true}
        emptyLabel="mm/dd/yyyy"
        format="MM/dd/yyyy"
        value={props.value ? parseISO(props.value) : null}
        onChange={(e) => props.onChange(e)}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DateFieldEditComponent;
