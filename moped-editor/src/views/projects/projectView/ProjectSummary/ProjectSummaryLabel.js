import React from "react";
import { Icon, Typography } from "@material-ui/core";

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
      <Icon className={classes.editIcon} onClick={onClickEdit}>
        edit
      </Icon>
    </>
  );
};

export default ProjectSummaryLabel;
