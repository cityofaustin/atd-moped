import { GridRowEditStopReasons, GridRowModes } from "@mui/x-data-grid-pro";

export const defaultEditColumnIconStyle = { fontSize: "24px" };

/**
 * Checks if a DataGrid inline edit input is empty to initialize validation state
 * as invalid; an empty required field is not valid no matter the data type
 * @param {string|object|array|number|boolean|null|undefined} value - value of input
 * @returns
 */
export const isEmpty = (value) => {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  // Check for array first since it is also an object
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

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
      setRows(rows.filter((row) => row.id !== params.row.id));
    }
  }
};

/**
 * Uses the rowModesModel to determine if any row is currently in edit mode
 * Example: Disable "Add Manually" button when any row is in edit mode to prevent
 * creating multiple unsaved rows which leads to inconsistent state
 * @param {Object} rowModesModel - The row modes model from the DataGrid
 * @returns {boolean} - True if any row is in edit mode, false otherwise
 */
export const getIsEditMode = (rowModesModel) =>
  Object.values(rowModesModel).some((m) => m?.mode === GridRowModes.Edit);
