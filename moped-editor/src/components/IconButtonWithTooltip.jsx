import React from "react";
import { Tooltip, IconButton } from "@mui/material";

/**
 * IconButton with Tooltip wrapper
 */
const IconButtonWithTooltip = ({
  title,
  tooltipProps,
  onClick,
  disabled,
  iconButtonSx,
  children,
  ariaLabel,
  size="small"
}) => {
  return (
    <Tooltip title={title} {...tooltipProps}>
      <span>
        {/* Tooltip needs to listen to child element events, span is needed if button is disabled */}
        <IconButton
          edge="end"
          aria-label={ariaLabel}
          onClick={onClick}
          size={size}
          disabled={disabled}
          sx={iconButtonSx}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default IconButtonWithTooltip;
