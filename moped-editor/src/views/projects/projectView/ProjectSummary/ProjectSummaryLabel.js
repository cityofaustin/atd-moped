import React from "react";
import { Tooltip, Typography } from "@material-ui/core";

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
  className,
  spanClassName,
  tooltipText,
}) => {
  return (
    // the tooltip will not appear if the `title` is empty
    <Tooltip placement="bottom-start" title={tooltipText || ""}>
      <Typography
        className={className ?? classes.fieldLabelText}
        onClick={onClickEdit}
      >
        {/* If there is no input, render a "-" */}
        {text.length === 0 && <span>-</span>}
        {/* If the input is an array, render one item per line */}
        {Array.isArray(text) &&
          text.map((element, i) => (
            <span key={i} className={spanClassName}>
              {element} <br />
            </span>
          ))}
        {/* Otherwise, render the input on one line */}
        {!Array.isArray(text) && <span className={spanClassName}>{text}</span>}
      </Typography>
    </Tooltip>
  );
};

export default ProjectSummaryLabel;
