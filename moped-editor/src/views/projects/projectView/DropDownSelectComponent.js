import React, { useMemo, useEffect } from "react";
import { handleKeyEvent } from "../../../utils/materialTableHelpers";
import { Select, MenuItem, FormControl } from "@material-ui/core";

// hook which keeps available subphase options in sync
const useSubphaseOptions = ({ phases, phaseId }) =>
  useMemo(() => {
    if (!phaseId || !phases) return [];
    // Find this phase's related subphases
    const allowedSubphases = phases.find(
      (item) => item?.phase_id === Number(phaseId)
    )?.moped_subphases;
    // Shape subphases for menu options
    return allowedSubphases.map((subphase) => ({
      value: subphase.subphase_id,
      label: subphase.subphase_name,
    }));
  }, [phases, phaseId]);

/**
 * DropDownSelectComponent - Renders a drop down menu for MaterialTable
 * @param {object} props - Values passed through Material Table `editComponent`
 * @return {JSX.Element}
 * @constructor
 */
const DropDownSelectComponent = ({ name, data, rowData, value, onChange }) => {
  const phaseId = rowData?.moped_phase?.phase_id;
  const phases = data.moped_phases;

  const subphaseOptions = useSubphaseOptions({
    phases,
    phaseId,
  });

  useEffect(() => {
    // this effect ensures the subphase value is reset when the row's
    // phase changes
    if (value && !subphaseOptions.find((option) => option.value === value)) {
      onChange("");
    }
  }, [value, subphaseOptions, phaseId, onChange]);

  // Hide this component if there are no related subphases
  if (subphaseOptions.length === 0) return null;

  return (
    <FormControl>
      <Select id={name} value={value ?? ""} style={{ minWidth: "8em" }}>
        {subphaseOptions.map(({ value, label }) => (
          <MenuItem
            onChange={() => onChange(value)}
            onClick={() => onChange(value)}
            onKeyDown={(e) => handleKeyEvent(e)}
            value={value || ""}
            key={value}
          >
            {label}
          </MenuItem>
        ))}
        {/* Enable this field to be blank - will coerce to null in save callback */}
        <MenuItem
          onChange={() => onChange("")}
          onClick={() => onChange("")}
          onKeyDown={(e) => handleKeyEvent(e)}
          value=""
        >
          -
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default DropDownSelectComponent;
