import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { Controller } from "react-hook-form";

/**
 * Test if an input is not null and can be coerced to a Date object.
 * @param {any} value - any value, but in our case either a string, a Date object,
 * an Invalid Date object, or null
 * @returns true if the value is not null and can be coerced to a Date object
 */
const isValidDateStringOrObject = (value) => {
  return value !== null && !isNaN(new Date(value));
};

/**
 * A react-hook-form wrapper of the MUI DatePicker component.
 * @param {object} control - react-hook-form `control` object from useController - required
 * @param {string} name - unique field name which be used in react-hook-form data object
 * @param {string} label - the label to render next to the checkbox
 * @param {bool} error - if the error state is active (triggers red outline around textfield)
 * @param {object} datePickerProps additional optional MUI date picker props
 * @return {JSX.Element}
 */
const ControlledDateField = ({
  name,
  control,
  label,
  error,
  ...datePickerProps
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        /**
         * The MUI component requires a Date object as the input value.
         * So we try to construct a Date object from the value in
         * react-hook-form.
         *
         * Otherwise just pass whatever the value is in state
         */
        let value = field.value;
        if (isValidDateStringOrObject(value)) {
          value = new Date(field.value);
        }
        return (
          <DatePicker
            size="small"
            label={label}
            slotProps={{
              textField: { size: "small", error },
              field: { clearable: true },
            }}
            value={value}
            onChange={(newValue) => {
              /**
               * This component's value is a Date object or an Invalid Date object.
               * If the date object is valid, we can convert it to an ISO string
               * and store the string in react-hook-form state.
               *
               * If the date object is invalid, we store the invalid date in
               * react-hook-form-state and let the Yup schema validation prevent
               * form submit.
               */
              const valueToStore = isValidDateStringOrObject(newValue)
                ? newValue.toISOString()
                : newValue;
              field.onChange(valueToStore);
            }}
            {...datePickerProps}
          />
        );
      }}
    />
  );
};

export default ControlledDateField;
