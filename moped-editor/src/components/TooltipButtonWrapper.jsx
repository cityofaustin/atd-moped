import React from "react";
import { Tooltip } from "@mui/material";

/**
 * Wrapper that puts a Tooltip around a button
 */
const TooltipButtonWrapper = ({ children, title, tooltipProps }) => {
  return (
    <Tooltip title={title} {...tooltipProps}>
      <span>
        {/* Tooltip needs to listen to child element events, span is needed if button is disabled */}
        {children}
      </span>
    </Tooltip>
  );
};

export default TooltipButtonWrapper;
