import React from "react";
import { MenuItem, Select } from "@mui/material";
import { handleKeyEvent } from "../utils/materialTableHelpers";
import { useGridApiContext } from "@mui/x-data-grid-pro";

/**
 * Component for dropdown select using a lookup table as options
 * @param {*} props
 * @returns {React component}
 */
const LookupSelectComponent = (props) => {
  const { id, value, field } = props;
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

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
      style={{ minWidth: "8em" }}
      id={props.name}
      value={value || props.defaultValue}
      ref={ref}
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
