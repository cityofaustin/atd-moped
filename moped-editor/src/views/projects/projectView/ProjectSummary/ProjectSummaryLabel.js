import React from "react";
import { Tooltip, Typography } from "@mui/material";
import { fieldLabelText } from "src/styles/reusableStyles";

/**
 *
 * @param {String} text - Label text
 * @param {function} onClickEdit - The function to call on edit click
 * @param {Object} sxProp - sx object determined by parent component
 * @param {Object} spanSxProp - sx object for span element determined by parent component
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryLabel = ({
  text,
  onClickEdit,
  sxProp,
  spanSxProp,
  tooltipText,
}) => {
  return (
    // the tooltip will not appear if the `title` is empty
    <Tooltip placement="bottom-start" title={tooltipText || ""}>
      <Typography
        sx={sxProp ?? fieldLabelText}
        onClick={onClickEdit}
        component="span"
      >
        {/* If there is no input, render a "-" */}
        {text.length === 0 && <span>-</span>}
        {/* If the input is an array, render one item per line */}
        {Array.isArray(text) &&
          text.map((element, i) => (
            <span key={i} sx={spanSxProp}>
              {element} <br />
            </span>
          ))}
        {/* Otherwise, render the input on one line */}
        {!Array.isArray(text) && <span sx={spanSxProp}>{text}</span>}
      </Typography>
    </Tooltip>
  );
};

export default ProjectSummaryLabel;
