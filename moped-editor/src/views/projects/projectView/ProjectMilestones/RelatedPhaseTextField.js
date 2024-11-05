import React from "react";
import { TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * @param {Integer} id - Data Grid row id
 * @param {String} value - field value
 * @param {String} field - name of field
 * @param {Boolean} hasFocus - does this field have focus
 * @param {Object} phaseNameLookupData - maps phase id to phase name
 * @param {Boolean} usingShiftKey - is the shift key being pressed during tabbing
 * @return {JSX.Element}
 */
const RelatedPhaseTextField = ({
  value,
  id,
  field,
  hasFocus,
  phaseNameLookupData,
  usingShiftKey,
}) => {
  const ref = React.useRef(null);
  const apiRef = useGridApiContext();

  // Because this field not editable, it cannot be focused and if a user is tabbing across the cells
  // the focus should be forwarded to the next one in the row
  React.useEffect(() => {
    if (hasFocus) {
      if (usingShiftKey) {
        apiRef.current.setCellFocus(id, "description");
      } else {
        apiRef.current.setCellFocus(id, "date_estimate");
      }
      ref.current.focus();
    }
  }, [apiRef, hasFocus, id, usingShiftKey]);

  return (
    <TextField
      variant="standard"
      style={{ width: "90%", paddingTop: "inherit" }}
      id={field}
      inputRef={ref}
      name={field}
      type="text"
      value={phaseNameLookupData[value?.related_phase_id] || " "}
      disabled
    />
  );
};

export default RelatedPhaseTextField;