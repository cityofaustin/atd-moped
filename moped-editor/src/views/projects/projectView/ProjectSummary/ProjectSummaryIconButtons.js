import React from "react";
import { IconButton, Icon } from "@mui/material";

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
    <>
      <IconButton disabled={disabledCondition || loading} onClick={handleSave}>
        <Icon>check</Icon>
      </IconButton>
      <IconButton onClick={handleClose}>
        <Icon>close</Icon>
      </IconButton>
    </>
  );
};

export default ProjectSummaryIconButtons;
