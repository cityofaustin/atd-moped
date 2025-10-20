import { Box, Typography, Stack } from "@mui/material";
import theme from "src/theme";

/**
 * Custom toolbar for MUI DataGridPro for consistent titles, spacing, and layout
 *
 * @param {string} title - Main title displayed on the top left
 * @param {React.ReactNode} primaryActionButton - Primary action button on top right
 * @param {React.ReactNode} secondaryActionButton - Optional secondary action button on top right
 * @param {React.ReactNode} children - Optional content for second row (forms, switches, buttons, etc.)
 */
const DataGridToolbar = ({
  title,
  primaryActionButton,
  secondaryActionButton,
  children,
}) => {
  const hasSecondRow = Boolean(children);

  return (
    <Box sx={{ padding: theme.spacing(2) }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ marginBottom: hasSecondRow ? theme.spacing(2) : 0 }}
      >
        <Typography variant="h2" color="primary">
          {title}
        </Typography>
        {(primaryActionButton || secondaryActionButton) && (
          <Stack direction="row" spacing={1} alignItems="center">
            {secondaryActionButton}
            {primaryActionButton}
          </Stack>
        )}
      </Box>
      {/* Optional Second Row */}
      {!!children && <Box>{children}</Box>}
    </Box>
  );
};

export default DataGridToolbar;
