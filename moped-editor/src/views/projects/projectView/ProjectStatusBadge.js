import React from "react";
import { Chip } from "@material-ui/core";

import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import PauseCircleOutlineOutlinedIcon from "@material-ui/icons/PauseCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import PlayCircleOutlineOutlinedIcon from "@material-ui/icons/PlayCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

const defaultIcon = HelpOutlineIcon;
const defaultLabel = "Unknown";

/**
 * Retrieves the style configuration for an individual phase
 * @param {Object} theme - The theme object
 * @param {string} phaseName - The phase name to be used as the badge label
 * @param {string} phaseKey - The key to be used to determine badge styles
 * @returns {Object}
 */
const getStyle = (theme, phaseKey) => {
  /**
   * Font colors
   */
  const primary = theme?.palette?.text?.primary;
  const white = theme?.palette?.common?.white;

  /**
   * Background color mapping
   */
  const backgroundColors = {
    default: theme?.palette?.grey?.[300],
    warning: theme?.palette?.warning?.light,
    success: theme?.palette?.success?.main,
    info: theme?.palette?.info?.dark,
    error: theme?.palette?.error?.main,
  };

  // Default background color
  const defaultBackgroundColor = backgroundColors.default;

  /**
   * Main style configuration per phase name, containing font `color`, chip `background` color and the icon.
   */
  const styleMapping = {
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
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    post_construction: {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    potential: {
      color: primary,
      background: backgroundColors.warning,
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
      background: defaultBackgroundColor,
      icon: defaultIcon,
    },
  };
  return styleMapping?.[phaseKey] ?? styleMapping.default;
};

/**
 * Picks the right color based on the status-phase combination
 */
const useFontColorStyles = makeStyles((theme) => ({
  root: {
    // Find text color
    color: (props) => getStyle(theme, props?.phaseKey ?? "").color,
  },
}));

const useStyles = makeStyles((theme) => ({
  clickableChip: {
    cursor: "pointer",
  },
}));

/**
 * Picks the right chip color based on status-phase combination
 */
const useChipStyles = makeStyles((theme) => ({
  root: {
    marginLeft: "1.5rem",
    fontWeight: "500",
    fontSize: "16px",
    borderRadius: "2rem",
    height: "2.5rem",
    padding: ".5rem",
    // Find background color
    backgroundColor: ({ phaseKey }) =>
      getStyle(theme, phaseKey ?? "").background,
  },
  condensed: {
    fontWeight: "500",
    fontSize: "12px",
    borderRadius: "2rem",
    height: "1.75rem",
    // Find background color
    backgroundColor: ({ phaseKey }) =>
      getStyle(theme, phaseKey ?? "").background,
  },
}));

/**
 * Renders a chip
 * @param {number} status - The status id of the current project
 * @param {string} phase - The current phase name of the project
 * @param {Object} projectStatuses - A dictionary of all available project statuses
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectStatusBadge = ({
  phaseKey,
  phaseName,
  condensed = false,
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
  const ChipIcon = getStyle(null, phaseKey ?? "")?.icon ?? defaultIcon;

  return (
    <Chip
      className={clsx(
        iconClasses.root,
        clickable && classes.clickableChip,
        condensed ? chipClasses.condensed : chipClasses.root
      )}
      icon={<ChipIcon className={iconClasses.root} />}
      label={phaseName || defaultLabel}
      color={"default"}
    />
  );
};

export default ProjectStatusBadge;
