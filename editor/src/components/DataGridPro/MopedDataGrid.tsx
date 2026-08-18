import {
  DataGridPro,
  type DataGridProProps,
  type GridValidRowModel,
} from "@mui/x-data-grid-pro";
import type { SxProps, Theme } from "@mui/material";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";

type MopedDataGridProps<R extends GridValidRowModel> = DataGridProProps<R> & {
  sx?: SxProps<Theme>;
};

/**
 * DataGridPro wrapper with default styles and props to ensure consistent styling and behavior of data grids
 * @param sx - additional style overrides to be applied on top of default styles, optional
 * @param props - other props to be passed to DataGridPro component
 */
const MopedDataGrid = <R extends GridValidRowModel>({
  sx,
  slotProps = {},
  ...props
}: MopedDataGridProps<R>) => {
  const mergedSx = {
    ...dataGridProStyleOverrides,
    ...sx,
  };

  const mergedSlotProps = {
    ...slotProps,
    loadingOverlay: {
      variant: "circular-progress" as const,
      noRowsVariant: "circular-progress" as const,
    },
  };

  return (
    <DataGridPro<R>
      sx={mergedSx}
      slotProps={mergedSlotProps}
      density="comfortable"
      getRowHeight={() => "auto"}
      hideFooter
      disableRowSelectionOnClick
      showToolbar={!!props.slots?.toolbar}
      onProcessRowUpdateError={(error) => console.error(error)}
      {...props}
    />
  );
};

export default MopedDataGrid;
