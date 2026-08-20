import React from "react";
import Chip from "@mui/material/Chip";
import { SxProps, Theme } from "@mui/material";

interface SecondaryInformationChipProps {
  chipLabel: React.ReactNode;
  chipStyles?: SxProps<Theme>;
}

/**
 * Shared component for secondary information
 * @param chipLabel - text displayed in chip
 * @param chipStyles - additional styles to apply to chip
 */
const SecondaryInformationChip = ({
  chipLabel,
  chipStyles,
}: SecondaryInformationChipProps) => (
  <Chip
    sx={{ height: "20px", ...chipStyles }}
    label={chipLabel}
    variant="outlined"
    color="primary"
  />
);

export default SecondaryInformationChip;
