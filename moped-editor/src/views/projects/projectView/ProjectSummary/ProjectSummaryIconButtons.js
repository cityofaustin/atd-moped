import React from "react";
import { IconButton, Icon } from "@mui/material";

const iconButtonStyles = {
  width: 40,
  height: 40,
  flexShrink: 0,
  alignSelf: "flex-start",
};

/**
 * ProjectSummaryIconButtons Component
 * @param {function} handleSave - Function to handle save action
 * @param {function} handleClose - Function to handle close action
 * @param {boolean} disabledCondition - Condition to disable the save button
 * @param {boolean} loading - Loading state to disable buttons
 * @returns {JSX.Element}
 */
const ProjectSummaryIconButtons = ({
  handleSave,
  handleClose,
  disabledCondition,
  loading,
}) => {
  return (
    <div style={{ display: "contents" }}>
      <IconButton
        disabled={disabledCondition || loading}
        onClick={handleSave}
        sx={iconButtonStyles}
        type="submit"
      >
        <Icon>check</Icon>
      </IconButton>
      <IconButton
        disabled={loading}
        onClick={handleClose}
        sx={iconButtonStyles}
      >
        <Icon>close</Icon>
      </IconButton>
    </div>
  );
};

export default ProjectSummaryIconButtons;
