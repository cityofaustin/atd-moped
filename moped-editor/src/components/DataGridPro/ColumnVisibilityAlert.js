import { Box, Alert } from "@mui/material";

export const ColumnVisibilityAlert = () => {
  return (
    <Box sx={{ justifyContent: "center" }}>
      <Alert severity="info">
        All columns are hidden. Use the column visibility menu to show columns.
      </Alert>
    </Box>
  );
};
