import {
  DataGridPro,
  type DataGridProProps,
  type GridValidRowModel,
} from "@mui/x-data-grid-pro";
import type { SxProps, Theme } from "@mui/material";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import useDataGridRowHighlight from "./useDataGridRowHighlight";

type MopedDataGridProps<R extends GridValidRowModel> = DataGridProProps<R> & {
  /** Optional style overrides merged with the default DataGrid style. */
  sx?: SxProps<Theme>;
  /** Search parameter used to identify the row to preselect. */
  highlightedRowParam?: string;
};

/**
 * DataGridPro wrapper with default styles and props to ensure consistent styling and behavior of data grids
 * Pass the row type as a generic to preserve type safety through DataGrid callbacks.
 *
 * @example
 * <MopedDataGrid<MyRowType>
 *   rows={rows}
 *   columns={columns}
 *   getRowId={(row) => row.id}  // row is typed as MyRowType
 * />
 */
const MopedDataGrid = <R extends GridValidRowModel>({
  sx,
  slotProps = {},
  getRowId,
  highlightedRowParam,
  apiRef,
  onCellClick,
  rowSelectionModel,
  rows = [],
  ...props
}: MopedDataGridProps<R>) => {
  const {
    apiRef: gridApiRef,
    handleCellClick,
    rowSelectionModel: highlightedRowSelectionModel,
  } = useDataGridRowHighlight({
    apiRef,
    getRowId,
    highlightedRowParam,
    onCellClick,
    rowSelectionModel,
    rows,
  });
  return (
    <DataGridPro<R>
      sx={{
        ...dataGridProStyleOverrides,
        ...sx,
      }}
      slotProps={{
        ...slotProps,
        loadingOverlay: {
          variant: "circular-progress",
          noRowsVariant: "circular-progress",
        },
      }}
      density="comfortable"
      getRowHeight={() => "auto"}
      hideFooter
      disableRowSelectionOnClick
      // Show toolbar if a toolbar slot is provided
      showToolbar={!!props.slots?.toolbar}
      onCellClick={handleCellClick}
      onProcessRowUpdateError={(error) => console.error(error)}
      getRowId={getRowId}
      apiRef={gridApiRef}
      rows={rows}
      {...props}
      rowSelectionModel={highlightedRowSelectionModel}
    />
  );
};

export default MopedDataGrid;
