import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import makeStyles from "@mui/styles/makeStyles";
import { getLookupValueByID } from "./utils/helpers";
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
 * @param {*} props
 * @returns {React component}
 */
 const LookupAutocompleteComponent = (props) => {
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
        value: newValue ? newValue[`${props.name}_id`] : null,
      });
    };

    return (
      <Autocomplete
        className={classes.autocompleteLookupInput}
        value={
          // if we are editing, the autocomplete has the value provided by the material table, which is the record id
          // need to get its corresponding text value
          props.value
            ? getLookupValueByID(props.lookupTable, props.name, value)
            : null
        }
        // use customized popper component so menu expands to fullwidth
        PopperComponent={CustomPopper}
        id={props.name}
        options={props.data}
        renderInput={(params) => (
          <TextField variant="standard" {...params} inputRef={ref} />
        )}
        getOptionLabel={(option) =>
          // if our value is a string, just return the string instead of accessing the name
          typeof option === "string" ? option : option[`${props.name}_name`]
        }
        isOptionEqualToValue={(value, option) =>
          value[`${props.name}_name`] === option
        }
        onChange={handleChange}
      />
    );
  };

export default LookupAutocompleteComponent;
