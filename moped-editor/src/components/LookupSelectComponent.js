import React from "react";
import { MenuItem, Select } from "@mui/material";
import { handleKeyEvent } from "../utils/materialTableHelpers";
import { useGridApiContext } from "@mui/x-data-grid-pro";
import theme from "src/theme";

/**
 * Component for dropdown select using a lookup table as options
 * @param {*} props
 * @returns {React component}
 */
const LookupSelectComponent = (props) => {
  const { id, value, field, hasFocus } = props;
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const handleChange = (newValue) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue ? newValue[`${props.name}_id`] : null,
    });
  };

  return (
    <Select
      variant="standard"
      id={props.name}
      value={value || props.defaultValue}
      inputRef={ref}
      disableUnderline
      sx={{
        minWidth: "8em",
        padding: theme.spacing(1),
        // adding a border despite disabling it above because the default border is much lower than other inputs
        "& .MuiSelect-select": {
          borderBottom: "1px rgba(0, 0, 0, 0.42) solid",
        },
        "& .MuiSelect-select:hover": {
          borderBottom: "2px #212121 solid",
        },
      }}
    >
      {props.data.map((item) => (
        <MenuItem
          onChange={() => handleChange(item)}
          onClick={() => handleChange(item)}
          onKeyDown={(e) => handleKeyEvent(e)}
          value={item[`${props.name}_id`]}
          key={item[`${props.name}_name`]}
        >
          {item[`${props.name}_name`]}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LookupSelectComponent;
