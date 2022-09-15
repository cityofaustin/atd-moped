import React from "react";
import { handleKeyEvent } from "../../../utils/materialTableHelpers";
import {
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import { phaseNameLookup } from "src/utils/timelineTableHelpers";

/**
 * DropDownSelectComponent - Renders a drop down menu for MaterialTable
 * @param {object} props - Values passed through Material Table `editComponent`
 * @param {string} name - Field name
 * @return {JSX.Element}
 * @constructor
 */
const DropDownSelectComponent = (props) => {
  console.log(props);
  // If the component name is phase_name, then use phaseNameLookup values, otherwise set as null
  let lookupValues =
    props.name === "phase_name" ? phaseNameLookup(props.data) : null;

  // If lookup values is null, then it is a sub-phase list we need to generate
  if (lookupValues === null) {
    // First retrieve the sub-phase id's from moped_phases for that specific row
    const allowedSubphases = props.data.moped_phases.find(
      (item) => item?.phase_id === Number(props.rowData?.phase_id ?? 0)
    )?.moped_subphases;

    // If there are no subphases, hide the drop-down.
    if (!allowedSubphases || allowedSubphases.length === 0) {
      return null;
    }

    // We have a usable array of sub-phase ids, generate lookup values,
    lookupValues = allowedSubphases.reduce((obj, subphase) => {
      obj[subphase.subphase_id] = subphase.subphase_name;
      return obj;
    }, {});
  }

  // empty subphases can show up as 0, this removes warning in console
  lookupValues = { ...lookupValues, 0: "" };

  // Proceed normally and generate the drop-down
  return (
    <FormControl>
      <Select
        id={props.name}
        value={props.value ?? ""}
        style={{ minWidth: "8em" }}
      >
        {Object.keys(lookupValues).map((key) => {
          return (
            <MenuItem
              onChange={() => props.onChange(key)}
              onClick={() => props.onChange(key)}
              onKeyDown={(e) => handleKeyEvent(e)}
              value={key}
              key={key}
            >
              {lookupValues[key]}
            </MenuItem>
          );
        })}
        <MenuItem
          onChange={() => props.onChange("")}
          onClick={() => props.onChange("")}
          onKeyDown={(e) => handleKeyEvent(e)}
          value=""
        >
          -
        </MenuItem>
      </Select>
      {props.name === "phase_name" && <FormHelperText>Required</FormHelperText>}
    </FormControl>
  );
};

export default DropDownSelectComponent;
