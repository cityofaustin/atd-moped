import React, { useState } from "react";
import { TextField } from "@mui/material";
import {
  currencyFormatter,
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
  /** Selected FDU's appropriated amount, if available. */
  appropriatedAmount?: number | null;
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
  appropriatedAmount,
  error = false,
  errorMessage = null,
}: DollarAmountIntegerFieldProps) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef<HTMLInputElement>(null);
  const [appropriationError, setAppropriationError] = useState(false);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current?.focus();
    }
  }, [hasFocus]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = event.target;
    const valueWithIntegersOnly = inputValue
      ? removeNonIntegers(removeDecimalsAndTrailingNumbers(inputValue))
      : "";
    const numericValue =
      valueWithIntegersOnly === "" ? null : Number(valueWithIntegersOnly);

    if (
      appropriatedAmount !== null &&
      appropriatedAmount !== undefined &&
      numericValue !== null &&
      numericValue >= appropriatedAmount
    ) {
      setAppropriationError(true);
      return;
    }

    setAppropriationError(false);
    apiRef.current.setEditCellValue({
      id,
      field,
      value: numericValue,
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
      value={
        value === null || value === undefined || value === ""
          ? ""
          : currencyFormatter.format(Number(value))
      }
      onChange={handleChange}
      error={error || appropriationError}
      helperText={
        appropriationError &&
        appropriatedAmount !== null &&
        appropriatedAmount !== undefined
          ? `Amount cannot exceed appropriated amount of ${currencyFormatter.format(appropriatedAmount)}`
          : error
            ? errorMessage
            : null
      }
    />
  );
};

export default DollarAmountIntegerField;
