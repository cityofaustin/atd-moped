import React from "react";
import { Typography } from "@material-ui/core";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";

/**
 *
 * @param {String} text - Label text
 * @param {Object} classes - The style classes from parent
 * @param {function} onClickEdit - The function to call on edit click
 * @param {Object} className - Class name override if present
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryLabel = ({
  text,
  classes,
  onClickEdit,
  className = null,
}) => {
  return (
    <>
      <Typography className={className ?? classes.fieldLabelText}>
        {text}
      </Typography>
      <CreateOutlinedIcon className={classes.editIcon} onClick={onClickEdit} />
    </>
  );
};

export default ProjectSummaryLabel;
