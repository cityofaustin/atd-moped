import type {
  DataGridProProps,
  GridValidRowModel,
  GridInitialState,
} from "@mui/x-data-grid-pro";
import MopedDataGrid from "src/components/DataGridPro/MopedDataGrid";

type MopedDataGridInlineEditProps<R extends GridValidRowModel> =
  DataGridProProps<R> & {
    /** Optional boolean indicating whether the inline edit functionality is enabled */
    canEdit?: boolean;
    /** Optional initial state of the data grid */
    initialState?: GridInitialState;
  };

/**
 * MopedDataGrid wrapper with default props to ensure consistent styling and behavior of inline edit data grids
 * Pass the row type as a generic to preserve type safety through DataGrid callbacks.
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
