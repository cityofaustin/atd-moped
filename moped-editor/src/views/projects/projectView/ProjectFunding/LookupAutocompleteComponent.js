import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import makeStyles from "@mui/styles/makeStyles";
import { getLookupValueByID } from "src/components/DataGridPro/utils/helpers";
import CustomPopper from "src/components/CustomPopper";

const useStyles = makeStyles((theme) => ({
  autocompleteLookupInput: {
    minWidth: "200px",
    alignContent: "center",
    padding: theme.spacing(1),
  },
}));

/**
 * Component for dropdown select using a lookup table as options
 * @param {Number} id - row id in Data Grid
 * @param {string} value - Field value
 * @param {string} field - name of Field
 * @param {Boolean} hasFocus - is field focused
 * @param {String} name - name of lookup table
 * @param {Array|Objects} lookupTable - the lookup table data
 * @returns {React component}
 */
const LookupAutocompleteComponent = ({
  id,
  value,
  field,
  hasFocus,
  name,
  lookupTable,
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
      value: newValue ? newValue[`${name}_id`] : null,
    });
  };

  return (
    <Autocomplete
      className={classes.autocompleteLookupInput}
      value={
        // if we are editing, the autocomplete has the value provided by the material table, which is the record id
        // need to get its corresponding text value
        value ? getLookupValueByID(lookupTable, name, value) : null
      }
      // use customized popper component so menu expands to fullwidth
      PopperComponent={CustomPopper}
      id={name}
      options={lookupTable}
      renderInput={(params) => (
        <TextField variant="standard" {...params} inputRef={ref} />
      )}
      getOptionLabel={(option) =>
        // if our value is a string, just return the string instead of accessing the name
        typeof option === "string" ? option : option[`${name}_name`]
      }
      isOptionEqualToValue={(value, option) => value[`${name}_name`] === option}
      onChange={handleChange}
    />
  );
};

export default LookupAutocompleteComponent;
