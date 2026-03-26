import { Box, Typography, Stack } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarFilterButton,
} from "@mui/x-data-grid-pro";
import DocumentationIconLink from "src/components/DocumentationIconLink";

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
      <Box
        sx={[
          {
            p: 2,
          },
          hasSecondRow
            ? {
                pb: 1,
              }
            : {
                pb: 2,
              },
        ]}
      >
        <Box
          sx={[
            {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            },
            hasSecondRow
              ? {
                  pb: 1,
                }
              : {
                  pb: 0,
                },
          ]}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h2" color="primary">
              {title}
            </Typography>
            {documentationLink ? (
              <DocumentationIconLink
                iconButtonSx={{ ml: 1, minWidth: 3 }}
                documentationLink={documentationLink}
              />
            ) : null}
          </Box>
          {(primaryActionButton || secondaryActionButton) && (
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
              }}
            >
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
