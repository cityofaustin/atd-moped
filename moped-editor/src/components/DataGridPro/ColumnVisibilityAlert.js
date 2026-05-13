import { Alert } from "@mui/material";

export const ColumnVisibilityAlert = ({ allColumnsHidden }) => {
  return (
    <div
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Alert>
        <span
          sx={{
            justifyContent: "text-no-wrap",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>Use the settings menu to add columns</span>
        </span>
      </Alert>
    </div>
  );
};
