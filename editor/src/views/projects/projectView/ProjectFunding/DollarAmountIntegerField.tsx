import React from "react";
import { TextField } from "@mui/material";
import {
  removeDecimalsAndTrailingNumbers,
  removeNonIntegers,
} from "src/utils/numberFormatters";
import {
  useGridApiContext,
  type GridRenderEditCellParams,
  type GridValidRowModel,
} from "@mui/x-data-grid-pro";

interface DollarAmountIntegerFieldProps extends GridRenderEditCellParams<
  GridValidRowModel,
  string | number | null
> {
  /* If the input validation failed - injected by preProcessEditCellProps */
  error?: boolean;
  /* Error message text from input validation - injected by preProcessEditCellProps */
  errorMessage?: string | null;
}

/**
 * MUI TextField wrapper that limits input to 0-9 for project funding amount
 * and handles editors pasting a number with a decimal Ex. $86,753.09 -> 86753
 */
const DollarAmountIntegerField = ({
  id,
  value,
  field,
  hasFocus,
  error = false,
  errorMessage = null,
}: DollarAmountIntegerFieldProps) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current?.focus();
    }
  }, [hasFocus]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = event.target;
    // First, remove decimal point and trailing characters onChange to handle pasted numbers
    const valueWithoutDecimals = removeDecimalsAndTrailingNumbers(inputValue);

    // Then, remove all non-integers
    const valueWithIntegersOnly = removeNonIntegers(valueWithoutDecimals);

    apiRef.current.setEditCellValue({
      id,
      field,
      value: valueWithIntegersOnly,
    });
  };

  return (
    <TextField
      variant="standard"
      style={{ minWidth: "80px" }}
      id={field}
      inputRef={ref}
      name={field}
      type="text"
      inputMode="numeric"
      value={value ?? ""}
      onChange={handleChange}
      error={error}
      helperText={error ? errorMessage : null}
    />
  );
};

export default DollarAmountIntegerField;
