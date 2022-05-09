import React from "react";
import { TextField } from "@material-ui/core";

/**
 * MUI TextField wrapper that limits input to 0-9 for project funding amount
 * @param {Function} props.onChange - Material Table handler to update field value
 * @param {String} props.value - Material Table field value
 * @return {JSX.Element}
 */
const FundingAmountIntegerField = ({ onChange, value }) => {
  const handleInputChange = ({ target }) => {
    onChange(target.value);
  };

  const handleKeyPress = event => {
    // Handle some usability issues noted by MUI
    // This also covers our need to allow only integers for this field
    // https://mui.com/material-ui/react-text-field/#type-quot-number-quot
    const unpermittedCharacters = ["+", "-", "e", "."];

    if (unpermittedCharacters.includes(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <TextField
      id="funding_amount"
      name="funding_amount"
      type="number"
      value={value}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
    />
  );
};

export default FundingAmountIntegerField;
