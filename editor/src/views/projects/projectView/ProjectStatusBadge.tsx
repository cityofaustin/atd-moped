import { Chip } from "@mui/material";
import { defaultIcon, defaultLabel, styleMapping } from "src/utils/phases";

/**
 * Retrieves the style configuration for an individual phase
 */
const getStyle = (phaseKey: string) => {
  return styleMapping?.[phaseKey] ?? styleMapping.default;
};

interface GetChipStylesProps {
  phaseKey?: string;
  condensed?: boolean;
  clickable?: boolean;
  leftMargin?: boolean;
}

/**
 * Gets the chip styles based on phase key and options
 */
const getChipStyles = ({
  phaseKey,
  condensed = false,
  clickable = false,
  leftMargin = false,
}: GetChipStylesProps) => {
  const style = getStyle(phaseKey);
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
 */
interface ProjectStatusBadgeProps {
  phaseKey?: string;
  phaseName?: string;
  condensed?: boolean;
  leftMargin?: boolean;
  clickable?: boolean;
}

const ProjectStatusBadge = ({
  phaseKey = "",
  phaseName = "",
  condensed = false,
  leftMargin = false,
  clickable = false,
}: ProjectStatusBadgeProps) => {
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
