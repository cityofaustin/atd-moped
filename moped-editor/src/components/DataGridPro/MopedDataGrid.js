import { DataGridPro } from "@mui/x-data-grid-pro";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";

const MopedDataGrid = ({ sx, ...props }) => (
  <DataGridPro
    sx={{ ...dataGridProStyleOverrides, ...sx }}
    density="comfortable"
    getRowHeight={() => "auto"}
    hideFooter
    disableRowSelectionOnClick
    onProcessRowUpdateError={(error) => console.error(error)}
    {...props}
  />
);

export default MopedDataGrid;
