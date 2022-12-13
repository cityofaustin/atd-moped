import React from "react";
import { TextField } from "@material-ui/core";
import {
  removeDecimalsAndTrailingNumbers,
  removeNonIntegers,
} from "src/utils/numberFormatters";

/**
 * MUI TextField wrapper that limits input to 0-9 for project funding amount
 * and handles editors pasting a number with a decimal Ex. $86,753.09 -> 86753
 * @param {Function} props.onChange - Material Table handler to update field value
 * @param {String} props.value - Material Table field value
 * @return {JSX.Element}
 */
const DollarAmountIntegerField = ({ onChange, value }) => {
  const handleInputChange = event => {
    const { value: inputValue } = event.target;

    // First, remove decimal point and trailing characters onChange to handle pasted numbers
    const valueWithoutDecimals = removeDecimalsAndTrailingNumbers(inputValue);

    // Then, remove all non-integers
    const valueWithIntegersOnly = removeNonIntegers(valueWithoutDecimals);

    onChange(valueWithIntegersOnly);
  };

  return (
    <TextField
      id="funding_amount"
      name="funding_amount"
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleInputChange}
    />
  );
};

export default DollarAmountIntegerField;
