import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

/**
 * Coerces empty strings to `null`
 */
const defaultOnChangeHandler = (
  value: string,
  field: { onChange: (value: unknown) => void }
) => field.onChange(value || null);

/**
 * Coerces falsey values to an empty string
 */
const defaultValueHandler = (value: string): string =>
  value ? String(value) : "";

export type ControlledTextInputProps<T extends FieldValues> = {
  /** Unique field name used in the react-hook-form data object. */
  name: Path<T>;
  /** react-hook-form `control` object from `useForm`. */
  control: Control<T>;
  /**
   * Callback fired when the input value changes. Keeps react-hook-form state
   * in sync with the field input state.
   *
   * @param value - the current input value (raw string from the event)
   * @param field - the react-hook-form field object
   */
  onChangeHandler?: (
    value: string,
    field: { onChange: (value: unknown) => void }
  ) => void;
  /**
   * Optional transform from the value stored in react-hook-form state to the
   * value rendered in the input.
   */
  valueHandler?: (value: unknown) => string;
} & Omit<TextFieldProps, "name" | "value" | "onChange" | "control">;

/**
 * A react-hook-form wrapper of the MUI `TextField` component. Enables custom
 * transforms of the value saved in form state, which by default coerces empty
 * strings to `null`.
 */
export default function ControlledTextInput<T extends FieldValues>({
  name,
  control,
  onChangeHandler = defaultOnChangeHandler,
  valueHandler = defaultValueHandler,
  slotProps,
  onBlur,
  ...textFieldProps
}: ControlledTextInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...textFieldProps}
          name={field.name}
          ref={field.ref}
          value={valueHandler(field.value)}
          onChange={(e) => onChangeHandler(e.target.value, field)}
          onBlur={(e) => {
            field.onBlur();
            onBlur?.(e);
          }}
          slotProps={{
            ...slotProps,
            input: {
              ...(typeof slotProps?.input === "object" ? slotProps.input : {}),
            },
          }}
        />
      )}
    />
  );
}
