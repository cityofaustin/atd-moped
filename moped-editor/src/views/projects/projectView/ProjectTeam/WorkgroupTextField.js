import React from "react";
import { TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useGridApiContext } from "@mui/x-data-grid-pro";

const useStyles = makeStyles((theme) => ({
  readOnlyInput: {
    width: "90%",
    paddingTop: "inherit",
    paddingLeft: theme.spacing(1),
  },
}));

const WorkgroupTextField = ({
  field,
  value,
  id,
  hasFocus,
  usingShiftKey,
  workgroupLookup,
}) => {
  const ref = React.useRef(null);
  const apiRef = useGridApiContext();
  const classes = useStyles();

  // Because this field not editable, it cannot be focused and if a user is tabbing across the cells
  // the focus should be forwarded to the next one in the row
  React.useEffect(() => {
    if (hasFocus) {
      // Check if shift key is pressed, and user is trying to tab "backwards"
      if (usingShiftKey) {
        apiRef.current.setCellFocus(id, "moped_user");
      } else {
        apiRef.current.setCellFocus(id, "moped_proj_personnel_roles");
      }
      ref.current.focus();
    }
  }, [apiRef, hasFocus, id, usingShiftKey]);

  return (
    <TextField
      variant="standard"
      className={classes.readOnlyInput}
      id={field}
      inputRef={ref}
      name={field}
      type="text"
      value={workgroupLookup[value.workgroup_id] || ""}
      InputProps={{ readOnly: true, disableUnderline: true }}
    />
  );
};

export default WorkgroupTextField;
