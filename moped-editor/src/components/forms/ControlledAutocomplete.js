import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

/**
 * Defines the callback handler for when a field value changes. This function keeps
 * react-hook-form state in sync with the field input state. Since this is the default
 * handler, it merely saves the exact value(s) selected into react-hook-form state
 * @param {any} option the selected option (or array of options if multiple)
 * @param {*} field the react-hook-form field object
 * @returns undefined
 */
const defaultOnChangeHandler = (option, field) => field.onChange(option);

/**
 * Manually override the `required` setting on the field in cases where the `multiple`
 * prop is enabled and a value is present.
 * Working around a very unfortunate issue: https://github.com/mui/material-ui/issues/21663
 * @param {any} value the field value
 * @param {bool} required if field is required aka not nullable
 * @param {bool} multiple if the field is a multiple select
 * @returns bool
 */
const getIsFieldRequired = (value, required, multiple) => {
  if (!multiple || !required || !value) return required;
  // if the field is multiple, required, and there is a value we
  // manually remove required constraint
  return value?.length < 1;
};

/**
 * A react-hook-form wrapper of the MUI autocomplete component
 * @param {bool} autoFocus input prop: should the input autofocus on mount. ignored if
 *  renderInput prop is used
 * @param {object} control react-hook-form `control` object from useController - required
 * @param {string} error an optional error message to display. will trigger error styles
 *  when not null
 * @param {string} helperText input prop: help text to be displayed below input.
 *  ignored if renderInput prop is used
 * @param {object[]} options array of option values. can take any shape but must be paired with
 * the appropriate onChangeHandler, valueHandler, autoCompleteProps.getOptionLabel(), and
 * autoCompleteProps.isOptionEqualToValue()
 * @param {string} label input prop: the field label. ignored if renderInput prop is used
 * @param {string} name unique field name which be used in react-hook-form data object
 * @param {function} onChangeHandler  Defines the callback handler for when a field value
 * changes. This function keeps react-hook-form state in sync with the field input state.
 * must have the signature (field, option) => void. where `field` is the react-hook-form field object and
 * `option` is the selected option.
 * @param {bool} required If the field is required. causes asterisk (*) to be displayed next
 * to field name and enables native form validation
 * @param {string} size input prop: ignored if renderInput prop is used
 * @param {function} valueHandler optional function which transforms the field's value from what
 * is saved in react-hook-form state vs what is rendered in the input. The value returned by this function is
 * passed to the `isOptionEqualToValue` test.
 * @param {object} autoCompleteProps additional optional MUI autocomplete props. notable props
 * include `isOptionEqualToValue` and `getOptionLabel`. see MUI autocomplete docs.
 * @return {JSX.Element}
 */
/** */
export default function ControlledAutocomplete({
  autoFocus = false,
  control,
  error,
  helperText,
  options,
  label,
  name,
  onChangeHandler = defaultOnChangeHandler,
  required,
  size = "small",
  valueHandler,
  ...autoCompleteProps
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const value = valueHandler ? valueHandler(field.value) : field.value;
        const isFieldRequired = getIsFieldRequired(
          value,
          required,
          autoCompleteProps?.multiple
        );
        return (
          <Autocomplete
            {...field}
            onChange={(_event, option) => onChangeHandler(option, field)}
            options={options}
            value={value}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={field.ref}
                size={size}
                label={label}
                variant="outlined"
                autoFocus={autoFocus}
                helperText={helperText}
                error={error}
                required={isFieldRequired}
                {...(isFieldRequired
                  ? { InputLabelProps: { required: true } }
                  : {})}
              />
            )}
            {...autoCompleteProps}
          />
        );
      }}
    />
  );
}
