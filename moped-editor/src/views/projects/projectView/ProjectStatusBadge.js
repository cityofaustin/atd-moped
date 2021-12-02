import React from "react";
import { Chip } from "@material-ui/core";

import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import PauseCircleOutlineOutlinedIcon from "@material-ui/icons/PauseCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import PlayCircleOutlineOutlinedIcon from "@material-ui/icons/PlayCircleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";

import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

const defaultIcon = PlayCircleOutlineOutlinedIcon;

/**
 * Retrieves the style configuration for an individual phase
 * @param {Object} theme - The theme object, if null the function returns null
 * @param {string} phase - The phase name
 * @returns {Object|null}
 */
const getStyle = (theme, phase) => {
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
    active: {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    planned: {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    "preliminary engineering": {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    scoping: {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    "preliminary design": {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    design: {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    "pre-construction": {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    "bid/award/execution": {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    "construction-ready": {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    construction: {
      color: white,
      background: backgroundColors.success,
      icon: PlayCircleOutlineOutlinedIcon,
    },
    "post-construction": {
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
    "on hold": {
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

  return styleMapping?.[phase] ?? styleMapping.default;
};

/**
 * Picks the right color based on the status-phase combination
 */
const useFontColorStyles = makeStyles(theme => ({
  root: {
    // Find text color
    color: props => getStyle(theme, (props?.phase ?? "").toLowerCase()).color,
  },
}));

/**
 * Picks the right chip color based on status-phase combination
 */
const useChipStyles = makeStyles(theme => ({
  root: {
    marginLeft: "1.5rem",
    fontWeight: "500",
    fontSize: "16px",
    borderRadius: "2rem",
    height: "2.5rem",
    padding: ".5rem",

    // Find background color
    backgroundColor: props => getStyle(theme, props?.phase ?? "").background,
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
const ProjectStatusBadge = ({ status, phase, projectStatuses }) => {
  /**
   * Returns the label given a status-phase combination
   * @param {number} status - The status id number
   * @param {string} phase - The name of the phase
   * @returns {string}
   */
  const getComponentMapName = (status, phase) =>
    status > 1 // is not active?
      ? // Then it can be found as a status
        (
          projectStatuses.find(s => s.status_id === status)?.status_name ??
          String(phase)
        ) // if not, default to phase
          .toLowerCase()
      : // if it's active then it's a phase for sure
        String(phase).toLowerCase();

  /**
   * Bundle status properties object
   */
  const statusProperties = {
    status: status,
    phase: getComponentMapName(status, phase), // It's here so it can be corrected by status id
  };

  /**
   * Generate font, chip and icon classes
   */
  const chipClasses = useChipStyles(statusProperties);
  const iconClasses = useFontColorStyles(statusProperties);

  // If we don't have a status, then do not render.
  if (!!!status) return null;

  /**
   * Create an abstract component pointer
   */
  const ChipIcon =
    getStyle(null, getComponentMapName(status, phase))?.icon ?? defaultIcon;

  /**
   * Make sure the text in the chip is capital-case
   * @param {string} text - The contents of the chip text
   * @returns {string}
   */
  const capitalCase = text =>
    String(text)
      .charAt(0)
      .toUpperCase() +
    String(text)
      .toLowerCase()
      .substring(1);

  /**
   * Show chip is true if we have a phase or a valid status id
   * @type {boolean}
   */
  const showChip = (!!phase && String(phase).trim().length > 0) || status > 1;

  /**
   * Return the object
   */
  return (
    showChip &&
    ChipIcon && (
      <Chip
        className={clsx(iconClasses.root, chipClasses.root)}
        icon={<ChipIcon className={iconClasses.root} />}
        label={capitalCase(statusProperties?.phase)}
        color={"default"}
      />
    )
  );
};

export default ProjectStatusBadge;
