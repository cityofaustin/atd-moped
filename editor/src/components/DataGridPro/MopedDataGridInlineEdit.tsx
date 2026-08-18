import type {
  DataGridProProps,
  GridValidRowModel,
  GridInitialState,
} from "@mui/x-data-grid-pro";
import MopedDataGrid from "src/components/DataGridPro/MopedDataGrid";

type MopedDataGridInlineEditProps<R extends GridValidRowModel> =
  DataGridProProps<R> & {
    canEdit?: boolean;
    initialState?: GridInitialState;
  };

/**
 * MopedDataGrid wrapper with default props to ensure consistent styling and behavior of inline edit data grids
 * @param canEdit - whether the inline edit functionality is enabled, optional
 * @param initialState - initial state of the data grid, optional
 * @param props - other props to be passed to DataGridPro component
 */
const MopedDataGridInlineEdit = <R extends GridValidRowModel>({
  canEdit = true,
  initialState,
  ...props
}: MopedDataGridInlineEditProps<R>) => {
  return (
    <MopedDataGrid<R>
      editMode="row"
      initialState={{
        pinnedColumns: canEdit ? { right: ["edit"] } : {},
        ...initialState,
      }}
      {...props}
    />
  );
};

export default MopedDataGridInlineEdit;
