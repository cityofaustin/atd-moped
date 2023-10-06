import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";

/**
 * Coerces empty strings to `null`
 * @param {string} value  - the current input value
 * @param {*} field - the react-hook-form field object
 * @returns undefined
 */
const defaultOnChangeHandler = (value, field) => field.onChange(value || null);

/**
 * Coerces falsey values to an empty string
 * @param {string} value  - the current field value safed in RFH state
 * @returns {string} the field value or an empty string
 */
const defaultValueHandler = (value) => value || "";

/**
 * A react-hook-form wrapper of the MUI TextField component. Enables custom transform
 * of the value saved in form state, which by default coerces empty strings to `null`
 * @param {object} control - react-hook-form `control` object from useController - required
 * @param {string} name - unique field name which be used in RFH data object
 * @param {function} onChangeHandler -  Defines the callback handler for when a field value
 * changes. This function keeps react-hook-form state in sync with the field input state.
 * must have the signature (field, option) => void. where `field` is the RFH field object and
 * `option` is the selected option.
 * @param {function} valueHandler - optional function which transforms the field's value  from
 * what is saved in RFH state vs what is rendered in the input. The value returned by this
 * function is passed to the `isOptionEqualToValue` test.
 * @param {object} inputProps - optional additional MUI TextField props
 * @return {JSX.Element}
 */
export default function ControlledTextInput({
  name,
  control,
  onChangeHandler = defaultOnChangeHandler,
  valueHandler = defaultValueHandler,
  ...inputProps
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <TextField
            {...field}
            {...inputProps}
            onChange={(e) => onChangeHandler(e.target.value, field)}
            value={valueHandler(field.value)}
            error={!!inputProps?.error}
          />
        );
      }}
    />
  );
}
