import {
  DataGridPro,
  useGridApiRef,
  type DataGridProProps,
  type GridValidRowModel,
} from "@mui/x-data-grid-pro";
import type { SxProps, Theme } from "@mui/material";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";
import useDataGridRowHighlight from "./useDataGridRowHighlight";

type MopedDataGridProps<R extends GridValidRowModel> = DataGridProProps<R> & {
  /** Optional style overrides merged with the default DataGrid style. */
  sx?: SxProps<Theme>;
  /** URL search parameter used to identify and highlight a row. */
  highlightRowParam?: string;
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
  getRowClassName,
  getRowId,
  highlightRowParam,
  apiRef,
  rows = [],
  ...props
}: MopedDataGridProps<R>) => {
  const internalApiRef = useGridApiRef();
  const gridApiRef = apiRef ?? internalApiRef;
  const {
    eventHandlers,
    getRowClassNameWithHighlight,
    highlightedRowId,
  } = useDataGridRowHighlight({
    apiRef: gridApiRef,
    eventHandlers: props,
    getRowClassName,
    getRowId,
    highlightRowParam,
    rows,
  });
  return (
    <DataGridPro<R>
      sx={{
        ...dataGridProStyleOverrides,
        ...sx,
        ...(highlightedRowId !== null && {
          "& .moped-data-grid-highlighted-row": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }),
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
      getRowClassName={getRowClassNameWithHighlight}
      hideFooter
      disableRowSelectionOnClick
      // Show toolbar if a toolbar slot is provided
      showToolbar={!!props.slots?.toolbar}
      onProcessRowUpdateError={(error) => console.error(error)}
      getRowId={getRowId}
      apiRef={gridApiRef}
      rows={rows}
      {...props}
      {...eventHandlers}
    />
  );
};

export default MopedDataGrid;
