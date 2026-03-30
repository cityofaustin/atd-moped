import MopedDataGrid from "src/components/DataGridPro/MopedDataGrid";

const MopedInlineEditDataGrid = ({
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

export default MopedInlineEditDataGrid;
