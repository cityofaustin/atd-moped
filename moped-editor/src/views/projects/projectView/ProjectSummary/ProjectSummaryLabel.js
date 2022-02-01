import React from "react";
import { Typography } from "@material-ui/core";

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
  spanClassName = null,
}) => {
  return (
    <>
      <Typography
        className={className ?? classes.fieldLabelText}
        onClick={onClickEdit}
      >
        <span className={spanClassName ?? classes.fieldLabelTextSpan}>{text}</span>
      </Typography>
    </>
  );
};

export default ProjectSummaryLabel;
