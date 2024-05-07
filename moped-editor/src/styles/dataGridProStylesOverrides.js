// per the MUI datagrid docs: When the height of a row is set to "auto", the final height will follow exactly
// the content size and ignore the density. the docs recommend overriding the density style in order to have 
// compact density along with get row height auto

const dataGridProStyleOverrides = {
  "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
    py: "8px",
  },
  "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
    py: "8px",
  },
  // mui datagrid defaults to using palette.background.default from the theme as the color for the container backgrounds
  "&.MuiDataGrid-root": {
    "--DataGrid-containerBackground": "#fff",
    "--DataGrid-pinnedBackground": "#fff",
  },
};

export default dataGridProStyleOverrides;
