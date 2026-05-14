import { Alert } from "@mui/material";

export const ColumnVisibilityAlert = ({ allColumnsHidden }) => {
  return (
    <div
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Alert severity="warning">
        <span
          sx={{
            justifyContent: "text-no-wrap",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>
            All columns are hidden. Use the column visibility menu to show
            columns.
          </span>
        </span>
      </Alert>
    </div>
  );
};
