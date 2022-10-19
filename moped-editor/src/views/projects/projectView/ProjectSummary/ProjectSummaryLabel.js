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
      <span
        className={className ?? classes.fieldLabelText}
        onClick={onClickEdit}
      >
        {text.length === 0 && <Typography>-</Typography>}
        {!Array.isArray(text) && (
          <Typography className={spanClassName}>
            {text}
          </Typography>
        )}
        {Array.isArray(text) &&
          text.map((element, i) => (
            <Typography
              key={i}
              className={spanClassName}
            >
              {element}
            </Typography>
          ))}
      </span>
    </>
  );
};

export default ProjectSummaryLabel;
