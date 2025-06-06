import React from "react";
import { Chip } from "@mui/material";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { makeStyles } from "@mui/styles";
import clsx from "clsx";
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
 * Picks the right color based on the status-phase combination
 */
const useFontColorStyles = makeStyles(() => ({
  root: {
    // Find text color
    color: (props) => getStyle(props?.phaseKey ?? "").color,
  },
}));

const useStyles = makeStyles(() => ({
  clickableChip: {
    cursor: "pointer",
  },
}));

/**
 * Picks the right chip color based on status-phase combination
 */
const useChipStyles = makeStyles(() => ({
  root: {
    fontWeight: "500",
    fontSize: "16px",
    borderRadius: "2rem",
    height: "2.5rem",
    padding: ".5rem",
    // Find background color
    backgroundColor: ({ phaseKey }) => getStyle(phaseKey ?? "").background,
  },
  condensed: {
    fontWeight: "500",
    fontSize: "12px",
    borderRadius: "2rem",
    height: "1.75rem",
    // Find background color
    backgroundColor: ({ phaseKey }) => getStyle(phaseKey ?? "").background,
  },
  leftMargin: {
    marginLeft: "1rem",
  },
}));

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
  const classes = useStyles();

  /**
   * Generate chip and icon classes
   */
  const chipClasses = useChipStyles({ phaseKey });
  const iconClasses = useFontColorStyles({ phaseKey });

  /**
   * Create an abstract component pointer
   */
  const ChipIcon = getStyle(phaseKey ?? "")?.icon ?? defaultIcon;

  return (
    <Chip
      className={clsx(
        iconClasses.root,
        clickable && classes.clickableChip,
        condensed ? chipClasses.condensed : chipClasses.root,
        leftMargin && chipClasses.leftMargin
      )}
      // for some reason passing color as a prop is ensuring the iconClasses.root style is being used
      icon={<ChipIcon className={iconClasses.root} color="action" />}
      label={phaseName || defaultLabel}
      color={"default"}
    />
  );
};

export default ProjectStatusBadge;
