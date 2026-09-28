import React, { type SyntheticEvent, useCallback } from "react";
import {
  Autocomplete,
  type AutocompleteProps,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import {
  type GridRenderEditCellParams,
  useGridApiContext,
} from "@mui/x-data-grid-pro";
import FullWidthPopper from "src/components/FullWidthPopper";
import { filterOptions } from "src/utils/autocompleteHelpers";

/** A field in the same row whose value should update when the autocomplete value changes */
export interface DependentField<TOption> {
  /** Name of the dependent field */
  fieldName: string;
  /** Takes the newly selected option and returns the dependent field's new value */
  setFieldValue: (newValue: TOption | null) => unknown;
}

type LookupAutocompleteComponentProps<TOption extends object> = Pick<
  GridRenderEditCellParams,
  "id" | "field" | "hasFocus"
> & {
  /** Field value */
  value?: TOption | null;
  /** Name of lookup table relationship */
  name: string;
  /** The lookup table data */
  options: TOption[];
  /** Should component use custom Popper component */
  fullWidthPopper?: boolean;
  /** Props passed to the MUI Autocomplete component */
  autocompleteProps?: Partial<AutocompleteProps<TOption, false, false, false>>;
  /** Props passed to the renderInput TextField */
  textFieldProps?: TextFieldProps;
  /** Fields in the same row to update when the value changes */
  dependentFieldsArray?: DependentField<TOption>[];
  /** Function to refetch lookup table data when dropdown is opened */
  refetch?: () => unknown;
};

/**
 * Component for dropdown select using a lookup table as options
 */
const LookupAutocompleteComponent = <TOption extends object>({
  id,
  value,
  field,
  hasFocus,
  name,
  options,
  fullWidthPopper,
  autocompleteProps,
  textFieldProps,
  dependentFieldsArray,
  refetch,
}: LookupAutocompleteComponentProps<TOption>) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLInputElement>(null);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current?.focus();
    }
  }, [hasFocus]);

  React.useEffect(() => {
    // only refetch when when component has been passed a refetch function
    if (open && typeof refetch === "function") {
      refetch();
    }
  }, [open, refetch]);

  const handleChange = async (
    event: SyntheticEvent,
    newValue: TOption | null
  ) => {
    await apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });

    if (dependentFieldsArray && dependentFieldsArray.length > 0) {
      for (const field of dependentFieldsArray) {
        await apiRef.current.setEditCellValue({
          id,
          field: field.fieldName,
          value: field.setFieldValue(newValue),
        });
      }
    }
  };

  const defaultGetOptionLabel = useCallback(
    (option: TOption) =>
      String((option as Record<string, unknown>)[`${name}_name`] ?? ""),
    [name]
  );

  const defaultIsOptionEqualToValue = useCallback(
    (option: TOption, value: TOption) =>
      (option as Record<string, unknown>)[`${name}_id`] ===
      (value as Record<string, unknown>)[`${name}_id`],
    [name]
  );

  return (
    <Autocomplete
      sx={{ width: "100%", mx: 1, alignContent: "center" }}
      value={
        value && (value as Record<string, unknown>)[`${name}_id`] ? value : null
      }
      id={name}
      filterOptions={filterOptions}
      options={options}
      renderInput={(params) => (
        <TextField
          variant="standard"
          {...params}
          inputRef={ref}
          {...textFieldProps}
          slotProps={{
            ...params.slotProps,
            htmlInput: {
              "data-1p-ignore": true,
              ...params.slotProps.htmlInput,
            },
          }}
        />
      )}
      {...autocompleteProps}
      getOptionLabel={
        autocompleteProps?.getOptionLabel
          ? autocompleteProps.getOptionLabel
          : defaultGetOptionLabel
      }
      isOptionEqualToValue={
        autocompleteProps?.isOptionEqualToValue
          ? autocompleteProps.isOptionEqualToValue
          : defaultIsOptionEqualToValue
      }
      onChange={handleChange}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      slots={{
        popper: fullWidthPopper ? FullWidthPopper : undefined,
      }}
    />
  );
};

export default LookupAutocompleteComponent;
