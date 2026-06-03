import React from "react";
import { Tooltip, IconButton } from "@mui/material";

/**
 * IconButton with Tooltip wrapper
 * @param {string} title - text shown on the tooltip
 * @param {Function} onClick - onClick function passed to IconButton
 * @param {string} ariaLabel - aria-label for IconButton component
 * @param {React.ReactNode} children - children, expecting the icon to display in the IconButton
 * @param {Boolean} disabled - if IconButton should be disabled, default is false
 * @param {string} size - IconButton size prop, defaults to small
 * @param {Object} tooltipProps - additional props to be passed to Tooltip component (optional)
 * @param {Object} iconButtonProps - additional props to be passed to IconButton component (optional)
 * @return {JSX.Element}
 */
const IconButtonWithTooltip = ({
  title,
  onClick,
  ariaLabel,
  children,
  disabled = false,
  size = "small",
  tooltipProps,
  iconButtonProps,
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
          {...iconButtonProps}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default IconButtonWithTooltip;
