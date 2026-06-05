import { DataGridPro } from "@mui/x-data-grid-pro";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";

/**
 * DataGridPro wrapper with default styles and props to ensure consistent styling and behavior of data grids
 * @param {object} sx - additional style overrides to be applied on top of default styles, optional
 * @param {object} props - other props to be passed to DataGridPro component
 * @returns {JSX.Element}
 */
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
