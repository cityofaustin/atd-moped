import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Stack, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid-pro";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";

/**
 * Custom toolbar for MUI DataGridPro for consistent titles, spacing, and layout
 *
 * @param {string} title - Main title displayed on the top left
 * @param {React.ReactNode} primaryActionButton - Primary action button on top right
 * @param {React.ReactNode} secondaryActionButton - Optional secondary action button on top right
 * @param {boolean} showColumnsButton - Whether to show the DataGridPro columns settings button
 * @param {boolean} showFiltersButton - Whether to show the DataGridPro filters settings button
 * @param {string} documentationLink - Optional link to documentation
 * @param {React.ReactNode} children - Optional content for second row (forms, switches, buttons, etc.)
 */
const DataGridToolbar = ({
  title,
  primaryActionButton,
  secondaryActionButton,
  showColumnsButton = false,
  showFiltersButton = false,
  documentationLink = null,
  children,
}) => {
  const hasSecondRow = !!children;

  return (
    <>
      <Box sx={{ p: 2, pb: hasSecondRow ? 1 : 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ pb: hasSecondRow ? 1 : 0 }}
        >
          <Box display="flex" alignItems="center">
            <Typography variant="h2" color="primary">
              {title}
            </Typography>
            {documentationLink ? (
              <Tooltip title="View documentation">
                <Button
                  sx={{ ml: 1, minWidth: 3 }}
                  color="inherit"
                  size="small"
                >
                  <Link
                    component={RouterLink}
                    to={documentationLink}
                    target="_blank"
                    underline="none"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <MenuBookOutlined
                      sx={{ color: "text.secondary" }}
                      fontSize="small"
                    />
                  </Link>
                </Button>
              </Tooltip>
            ) : null}
          </Box>
          {(primaryActionButton || secondaryActionButton) && (
            <Stack direction="row" spacing={1} alignItems="center">
              {secondaryActionButton}
              {primaryActionButton}
            </Stack>
          )}
        </Box>
        {/* Optional Second Row */}
        {!!hasSecondRow && <Box>{children}</Box>}
      </Box>
      {showColumnsButton || showFiltersButton ? (
        <GridToolbarContainer sx={{ px: 2 }}>
          {showColumnsButton ? <GridToolbarColumnsButton /> : null}
          {showFiltersButton ? <GridToolbarFilterButton /> : null}
        </GridToolbarContainer>
      ) : null}
    </>
  );
};

export default DataGridToolbar;
