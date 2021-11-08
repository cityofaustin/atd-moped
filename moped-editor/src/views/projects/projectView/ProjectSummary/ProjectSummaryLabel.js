import React from "react";
import { Typography } from "@material-ui/core";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";

/**
 *
 * @param {String} text - Label text
 * @param {Object} classes - The style classes from parent
 * @param {function} onClickEdit - The function to call on edit click
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryLabel = ({ text, classes, onClickEdit }) => {
  return (
    <>
      <Typography className={classes.fieldLabelText}>{text}</Typography>
      <CreateOutlinedIcon className={classes.editIcon} onClick={onClickEdit} />
    </>
  );
};

export default ProjectSummaryLabel;
