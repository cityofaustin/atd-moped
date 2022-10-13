import React from "react";
import { Popper } from "@material-ui/core";

// https://stackoverflow.com/questions/63579345/how-can-i-change-the-width-of-material-ui-autocomplete-popover
// Customize popper to expand to fit the content
const CustomPopper = (props) => (
  <Popper
    {...props}
    style={{ width: "fit-content" }}
    placement="bottom-start"
  />
);

export default CustomPopper;
