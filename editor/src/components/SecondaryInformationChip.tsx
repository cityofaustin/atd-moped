import type { ReactNode } from "react";
import Chip from "@mui/material/Chip";
import type { SxProps, Theme } from "@mui/material";

interface SecondaryInformationChipProps {
  /** Text or React node displayed inside the chip. */
  chipLabel: ReactNode;
  /** Optional style overrides for the chip. Merged with defaults. */
  chipStyles?: SxProps<Theme>;
}

/**
 * Shared component for secondary information
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
