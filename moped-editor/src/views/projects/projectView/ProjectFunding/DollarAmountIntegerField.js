import React from "react";
import { TextField } from "@mui/material";
import {
  removeDecimalsAndTrailingNumbers,
  removeNonIntegers,
} from "src/utils/numberFormatters";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * MUI TextField wrapper that limits input to 0-9 for project funding amount
 * and handles editors pasting a number with a decimal Ex. $86,753.09 -> 86753
 * @param {Integer} id - Data Grid row id
 * @param {String} value - field value
 * @param {String} field - name of field
 * @return {JSX.Element}
 */
const DollarAmountIntegerField = ({ id, value, field, hasFocus }) => {
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleChange = (event, newValue) => {
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
      style={{ width: "80px" }}
      id="funding_amount"
      inputRef={ref}
      name="funding_amount"
      type="text"
      inputMode="numeric"
      value={value ?? ""}
      onChange={handleChange}
    />
  );
};

export default DollarAmountIntegerField;
