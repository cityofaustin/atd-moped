import type { ReactNode } from "react";
import {
  Tooltip,
  IconButton,
  type TooltipProps,
  type IconButtonOwnProps,
} from "@mui/material";

interface IconButtonWithTooltipProps {
  /** text shown on the tooltip*/
  title: TooltipProps["title"];
  /** onClick function passed to IconButton */
  onClick: () => void;
  /** aria-label for IconButton component */
  ariaLabel: string;
  /** children, expecting the icon to display in the IconButton */
  children?: ReactNode;
  /** if IconButton should be disabled, default is false */
  disabled?: IconButtonOwnProps["disabled"];
  /** IconButton size prop, defaults to small */
  size?: IconButtonOwnProps["size"];
  /** additional props to be passed to Tooltip component (optional) */
  tooltipProps?: TooltipProps;
  /** additional props to be passed to IconButton component (optional)*/
  iconButtonProps?: IconButtonOwnProps;
}

const IconButtonWithTooltip = ({
  title,
  onClick,
  ariaLabel,
  children,
  disabled = false,
  size = "small",
  tooltipProps,
  iconButtonProps,
}: IconButtonWithTooltipProps) => {
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
