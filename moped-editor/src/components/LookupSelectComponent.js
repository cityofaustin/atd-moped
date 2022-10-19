import React from "react";
import { MenuItem, Select } from "@material-ui/core";
import { handleKeyEvent } from "../utils/materialTableHelpers";

/**
 * Component for dropdown select using a lookup table as options
 * @param {*} props
 * @returns {React component}
 */
const LookupSelectComponent = (props) => (
  <Select
    style={{ minWidth: "8em" }}
    id={props.name}
    value={props.value || props.defaultValue}
  >
    {props.data.map((item) => (
      <MenuItem
        onChange={() => props.onChange(item[`${props.name}_id`])}
        onClick={() => props.onChange(item[`${props.name}_id`])}
        onKeyDown={(e) => handleKeyEvent(e)}
        value={item[`${props.name}_id`]}
        key={item[`${props.name}_name`]}
      >
        {item[`${props.name}_name`]}
      </MenuItem>
    ))}
    {props.columnDef.title === "Program" && (
      <MenuItem
        onChange={() => props.onChange("")}
        onClick={() => props.onChange("")}
        onKeyDown={(e) => handleKeyEvent(e)}
        value=""
      >
        -
      </MenuItem>
    )}
  </Select>
);

export default LookupSelectComponent;
