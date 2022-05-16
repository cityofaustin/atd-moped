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
const FundingAmountIntegerField = ({ onChange, value }) => {
  const setValidFundingAmount = number => {
    // First, remove decimal point and trailing characters onChange to handle pasted numbers
    const valueWithoutDecimals = removeDecimalsAndTrailingNumbers(number);

    // Then, remove all non-integers
    const valueWithIntegersOnly = removeNonIntegers(valueWithoutDecimals);
    console.log(number, valueWithoutDecimals, valueWithIntegersOnly);

    onChange(valueWithIntegersOnly);
  };

  const handleInputChange = event => {
    const { value: inputValue } = event.target;
    setValidFundingAmount(inputValue);
    // onChange(inputValue);
  };

  // const handlePaste = event => {
  //   // debugger;
  //   const { value: pastedValue } = event.target;
  //   setValidFundingAmount(pastedValue);
  // };

  // const filterNonIntegerKeys = event => {
  //   // Handle some usability issues with number type field noted by MUI
  //   // This also covers our need to allow only integers for this field
  //   // https://mui.com/material-ui/react-text-field/#type-quot-number-quot
  //   const unpermittedCharacters = ["+", "-", "e", "E", ".", "_", "=", ","];
  //   const isKeyNonInteger = event.key.match(/[0-9]/g) === null;

  //   // if (unpermittedCharacters.includes(event.key)) {
  //   //   event.preventDefault();
  //   // }
  //   if (isKeyNonInteger) {
  //     event.preventDefault();
  //   }
  // };

  return (
    <TextField
      id="funding_amount"
      name="funding_amount"
      // type="number"
      // InputProps={{ inputProps: { min: 0 } }}
      value={value}
      onChange={handleInputChange}
      // onPaste={handlePaste}
      // onKeyDown={filterNonIntegerKeys}
    />
  );
};

export default FundingAmountIntegerField;
