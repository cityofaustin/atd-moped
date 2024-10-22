import React from "react";
import {
  Autocomplete,
  TextField,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import makeStyles from "@mui/styles/makeStyles";
import CustomPopper from "src/components/CustomPopper";

const useStyles = makeStyles((theme) => ({
  fundSelectStyle: {
    width: "190px",
    alignContent: "center",
  },
}));

const MilestoneAutocompleteComponent = ({
  id,
  value,
  field,
  hasFocus,
  milestoneNameLookup,
}) => {
  const classes = useStyles();
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleChange = (event, newValue) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue ?? null,
    });
  };

  return (
    <FormControl variant="standard" style={{ width: "100%" }}>
      <Autocomplete
        id={"milestone_name"}
        name={"milestone_name"}
        options={Object.keys(milestoneNameLookup)}
        getOptionLabel={(option) => milestoneNameLookup[option]}
        isOptionEqualToValue={(option, value) => option === String(value)}
        value={value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField variant="standard" {...params} inputRef={ref} />
        )}
      />
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};

export default MilestoneAutocompleteComponent;
