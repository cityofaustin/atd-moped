import React from "react";
import { Chip } from "@mui/material";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import theme from "src/theme";

const defaultIcon = HelpOutlineIcon;
const defaultLabel = "Unknown";

/**
 * Font colors
 */
const primary = theme?.palette?.text?.primary;
const white = theme?.palette?.background?.paper;

/**
 * Background color mapping
 */
const backgroundColors = {
  default: theme?.palette?.grey?.[300],
  warning: theme?.palette?.warning?.light,
  success: theme?.palette?.success?.light,
  info: theme?.palette?.info?.main,
  error: theme?.palette?.error?.main,
};

/**
 * Main style configuration per phase name, containing font `color`, chip `background` color and the icon.
 */
export const styleMapping = {
  planned: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  preliminary_engineering: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  scoping: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  preliminary_design: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  design: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  pre_construction: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  bid_award_execution: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  construction_ready: {
    color: white,
    background: backgroundColors.success,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  construction: {
    color: primary,
    background: backgroundColors.warning,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  post_construction: {
    color: white,
    background: backgroundColors.info,
    icon: PlayCircleOutlineOutlinedIcon,
  },
  potential: {
    color: primary,
    background: backgroundColors.default,
    icon: RemoveCircleOutlineOutlinedIcon,
  },
  canceled: {
    color: white,
    background: backgroundColors.error,
    icon: CancelOutlinedIcon,
  },
  on_hold: {
    color: primary,
    background: backgroundColors.default,
    icon: PauseCircleOutlineOutlinedIcon,
  },
  complete: {
    color: white,
    background: backgroundColors.info,
    icon: CheckCircleOutlineOutlinedIcon,
  },
  default: {
    color: primary,
    background: backgroundColors.default,
    icon: defaultIcon,
  },
};

/**
 * Retrieves the style configuration for an individual phase
 * @param {string} phaseKey - The key used to determine badge styles
 * @returns {Object}
 */
const getStyle = (phaseKey) => {
  return styleMapping?.[phaseKey] ?? styleMapping.default;
};

/**
 * Gets the chip styles based on phase key and options
 */
const getChipStyles = ({
  phaseKey,
  condensed = false,
  clickable = false,
  leftMargin = false,
}) => {
  const style = getStyle(phaseKey ?? "");
  return {
    fontWeight: "500",
    fontSize: condensed ? "12px" : "16px",
    borderRadius: "2rem",
    height: condensed ? "1.75rem" : "2.5rem",
    padding: condensed ? undefined : ".5rem",
    backgroundColor: style.background,
    color: style.color,
    ...(clickable && { cursor: "pointer" }),
    ...(leftMargin && { marginLeft: "1rem" }),
  };
};

/**
 * Renders a chip
 * @param {string} phaseKey - phase name in key form
 * @param {string} phaseName - name of phase being rendered
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectStatusBadge = ({
  phaseKey,
  phaseName,
  condensed = false,
  leftMargin = false,
  clickable = false,
}) => {
  /**
   * Create an abstract component pointer
   */
  const style = getStyle(phaseKey ?? "");
  const ChipIcon = style?.icon ?? defaultIcon;

  return (
    <Chip
      sx={getChipStyles({ phaseKey, condensed, clickable, leftMargin })}
      icon={<ChipIcon sx={{ color: style.color }} color="action" />}
      label={phaseName || defaultLabel}
      color={"default"}
    />
  );
};

export default ProjectStatusBadge;
