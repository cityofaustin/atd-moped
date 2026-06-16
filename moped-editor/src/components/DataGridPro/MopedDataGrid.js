import { DataGridPro } from "@mui/x-data-grid-pro";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";

/**
 * DataGridPro wrapper with default styles and props to ensure consistent styling and behavior of data grids
 * @param {object} sx - additional style overrides to be applied on top of default styles, optional
 * @param {object} props - other props to be passed to DataGridPro component
 * @returns {JSX.Element}
 */
const MopedDataGrid = ({ sx, slotProps = {}, ...props }) => {
  const mergedRootSx = {
    ...dataGridProStyleOverrides,
    ...sx,
    ...(slotProps.root?.sx || {}),
  };

  const mergedSlotProps = {
    ...slotProps,
    loadingOverlay: {
      variant: "circular-progress",
      noRowsVariant: "circular-progress",
    },
    root: {
      ...(slotProps.root || {}),
      sx: mergedRootSx,
    },
  };

  return (
    <DataGridPro
      slotProps={mergedSlotProps}
      density="comfortable"
      getRowHeight={() => "auto"}
      hideFooter
      disableRowSelectionOnClick
      // Show toolbar if a toolbar slot is provided
      showToolbar={!!props.slots?.toolbar}
      onProcessRowUpdateError={(error) => console.error(error)}
      {...props}
    />
  );
};

export default MopedDataGrid;
