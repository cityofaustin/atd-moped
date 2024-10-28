import React from "react";
import { Button, TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

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
  id,
  field,
  hasFocus,
  helperText,
  error,
  phaseNameLookupData,
  ...props
}) => {
  const ref = React.useRef(null);
  const apiRef = useGridApiContext();


  React.useEffect(() => {
    if (hasFocus) {
      apiRef.current.setCellFocus(id, "date_estimate");
      ref.current.focus();
    }
  }, [hasFocus]);


//   const relatedPhaseId = props.relatedPhaseLookup[props.row.milestone_id];
  console.log(value)

  return (
    // <Button ref={ref} disableRipple disableFocusRipple>{phaseNameLookupData[value.related_phase_id]} </Button>

    <TextField
      variant="standard"
      style={{ width: "90%", paddingTop: "inherit" }}
      id={field}
      inputRef={ref}
      name={field}
      type="text"
      value={phaseNameLookupData[value.related_phase_id]}
      error={error}
      disabled
    />
  );
};

export default RelatedPhaseTextField;
