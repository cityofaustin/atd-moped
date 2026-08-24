import MopedDataGrid from "src/components/DataGridPro/MopedDataGrid";

/**
 * MopedDataGrid wrapper with default props to ensure consistent styling and behavior of inline edit data grids
 * @param {boolean} canEdit - whether the inline edit functionality is enabled, optional
 * @param {object} initialState - initial state of the data grid, optional
 * @param {object} props - other props to be passed to DataGridPro component
 * @returns {JSX.Element}
 */
const MopedDataGridInlineEdit = ({
  canEdit = true,
  initialState,
  ...props
}) => {
  return (
    <MopedDataGrid
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
