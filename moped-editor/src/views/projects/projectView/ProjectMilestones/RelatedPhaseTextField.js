import React from "react";
import { TextField } from "@mui/material";

/**
 * @param {Integer} id - Data Grid row id
 * @param {String} value - field value
 * @param {String} field - name of field
 * @param {Boolean} hasFocus - does this field have focus
 * @param {String} helperText - optional helper text
 * @param {Boolean} error - toggles error style in textfield
 * @return {JSX.Element}
 */
const RelatedPhaseTextField = ({
  value,
  field,
  hasFocus,
  helperText,
  error,
  phaseNameLookupData,
  ...props
}) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);


console.log(props)
console.log(phaseNameLookupData[null])
// console.log(relatedPhaseLookup)

const relatedPhaseId = props.relatedPhaseLookup[props.row.milestone_id]
  return (
    <TextField
      variant="standard"
      style={{ width: "inherit", paddingTop: "inherit" }}
      id={field}
      inputRef={ref}
      name={field}
      type="text"
      value={phaseNameLookupData[relatedPhaseId] ?? ""}
      error={error}
      disabled
    />
  );
};

export default RelatedPhaseTextField;
