import React from "react";
import { Tooltip, IconButton } from "@mui/material";

/**
 * IconButton with Tooltip wrapper
 */
const ButtonWithTooltip = ({
  title,
  tooltipProps,
  onClick,
  disabled,
  iconButtonSx,
  children,
}) => {
  return (
    <Tooltip title={title} {...tooltipProps}>
      <span>
        {/* Tooltip needs to listen to child element events, span is needed if button is disabled */}
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={onClick}
          size="small"
          disabled={disabled}
          sx={iconButtonSx}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ButtonWithTooltip;
