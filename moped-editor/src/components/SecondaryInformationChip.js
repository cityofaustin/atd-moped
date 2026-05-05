import Chip from "@mui/material/Chip";

/**
 * chia fill this out
 *
 * @param {string} chipLabel - text displayed in chip
 * @param {object} chipStyles - additional styles to apply to chip
 */
const SecondaryInformationChip = ({ chipLabel, chipStyles }) => (
  <Chip
    sx={{ height: "20px", ...chipStyles }}
    label={chipLabel}
    variant="outlined"
    color="primary"
  />
);

export default SecondaryInformationChip;
