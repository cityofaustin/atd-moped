import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import makeStyles from "@mui/styles/makeStyles";
import CustomPopper from "src/components/CustomPopper";

const useStyles = makeStyles((theme) => ({
  fundSelectStyle: {
    width: "190px",
    alignContent: "center",
  },
}));

const FundAutocompleteComponent = (props) => {
  const classes = useStyles();
  const { id, value, field, hasFocus } = props;
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
    <Autocomplete
      className={classes.fundSelectStyle}
      value={value ?? null}
      // use customized popper component so menu expands to fullwidth
      PopperComponent={CustomPopper}
      id="moped_funds"
      options={props.data}
      renderInput={(params) => (
        <TextField variant="standard" {...params} inputRef={ref} />
      )}
      getOptionLabel={(option) =>
        // if our value is a string, just return the string
        typeof option === "string"
          ? option
          : `${option.fund_id} | ${option.fund_name}`
      }
      isOptionEqualToValue={(value, option) =>
        value.fund_id === option.fund_id && value.fund_name === option.fund_name
      }
      onChange={handleChange}
    />
  );
};

export default FundAutocompleteComponent;
