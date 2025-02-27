import React from "react";
import { Popper } from "@mui/material";

// https://stackoverflow.com/questions/63579345/how-can-i-change-the-width-of-material-ui-autocomplete-popover
// Customize popper to expand to fit the content
const FullWidthPopper = (props) => (
  <Popper
    {...props}
    style={{ width: "fit-content" }}
    placement="bottom-start"
  />
);

export default FullWidthPopper;
