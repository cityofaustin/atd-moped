import React from "react";
import { TextField } from "@material-ui/core";

const FundingAmountTextField = props => {
  return (
    <TextField
      id="funding_amount"
      name="funding_amount"
      value={props.value}
      onChange={e => props.onChange(e.target.value)}
    />
  );
};

export default FundingAmountTextField;
