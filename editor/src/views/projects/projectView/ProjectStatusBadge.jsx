import React from "react";
import { Chip } from "@mui/material";
import { defaultIcon, defaultLabel, styleMapping } from "src/utils/phases";

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
