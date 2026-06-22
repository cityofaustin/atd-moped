import { GridRowEditStopReasons, GridRowModes } from "@mui/x-data-grid-pro";

export const defaultEditColumnIconStyle = { fontSize: "24px" };

/**
 * Custom event handler for the DataGrid `onRowEditStop` event that:
 * 1. Prevents saving on Enter key press
 * 2. Prevents saving on click-away
 * 3. Deletes unsaved new rows on Escape
 * @param {Array} rows - The current rows state
 * @param {Function} setRows - The rows state setter
 * @returns {Function} - A DataGrid `onRowEditStop` event handler
 */
export const handleRowEditStop = (rows, setRows) => (params, event) => {
  if (params.reason === GridRowEditStopReasons.rowFocusOut) {
    event.defaultMuiPrevented = true;
    return;
  }
  if (params.reason === GridRowEditStopReasons.enterKeyDown) {
    event.defaultMuiPrevented = true;
  }
  if (params.reason === GridRowEditStopReasons.escapeKeyDown) {
    if (params.row.isNew) {
      event.defaultMuiPrevented = true;
      setRows(rows.filter((row) => row.id !== params.row.id));
    }
  }
};

/**
 * Returns a handleCancelClick handler that prevents processRowUpdate from firing
 * when canceling drafts or edits on a row
 * @param {Array} rows - The current rows state
 * @param {Function} setRows - The rows state setter
 * @param {Object} rowModesModel - The current row modes model
 * @param {Function} setRowModesModel - The row modes model state setter
 * @param {Function} getRowId - Function to get the row's id field, defaults to row.id
 * @returns {Function} - A handleCancelClick handler
 */
export const handleCancelClick =
  (
    rows,
    setRows,
    rowModesModel,
    setRowModesModel,
    getRowId = (row) => row.id
  ) =>
  (id) =>
  () => {
    const editedRow = rows.find((row) => getRowId(row) === id);
    if (editedRow?.isNew) {
      setRows((prev) => prev.filter((row) => getRowId(row) !== id));
      setRowModesModel((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    } else {
      setRowModesModel((prev) => ({
        ...prev,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      }));
    }
  };

/**
 * Uses the rowModesModel to determine if any row is currently in edit mode
 * Example: Disable "Add Manually" button when any row is in edit mode to prevent
 * creating multiple unsaved rows which leads to inconsistent state
 * @param {Object} rowModesModel - The row modes model from the DataGrid
 * @returns {boolean} - True if any row is in edit mode, false otherwise
 */
export const getIsEditMode = (rowModesModel) => {
  console.log(rowModesModel);
  return Object.values(rowModesModel).some(
    (m) => m?.mode === GridRowModes.Edit
  );
};
