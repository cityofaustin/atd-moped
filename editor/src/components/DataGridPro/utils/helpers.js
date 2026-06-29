import { useCallback, useRef } from "react";
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

/**
 * Custom hook to contain workaround fix for bug described in https://github.com/mui/mui-x/issues/21766
 * Handles issue where canceling an edit on a row does not properly prevent the subsequent processRowUpdate from executing.
 * So, we track the ids of canceled rows and check those ids during processRowUpdate to skip mutation.
 */
export const useCanceledRowFix = ({ getRowId = (row) => row.id } = {}) => {
  // Track canceled row IDs so we can check in processRowUpdate if a row's edit was canceled
  // and skip mutations for those rows
  const canceledRowIds = useRef(new Set());

  /**
   * Call at the start of processRowUpdate to skip mutation if marked as canceled
   */
  const wasCanceled = useCallback((id) => {
    if (canceledRowIds.current.has(id)) {
      canceledRowIds.current.delete(id);
      return true;
    }
    return false;
  }, []);

  /**
   * Mark row as canceled by id
   */
  const markCanceled = useCallback((id) => {
    canceledRowIds.current.add(id);
  }, []);

  /**
   * Make cancel handler that marks rows as canceled and updates row and rowModesModel state
   */
  const makeHandleCancelClick = useCallback(
    ({ setRows, setRowModesModel }) =>
      (id) =>
      () => {
        markCanceled(id);
        // Remove the row's entry from the rowModesModel to force out of edit mode
        setRowModesModel((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
        // If the row is new, remove it from the rows state
        setRows((prev) => {
          const editedRow = prev.find((row) => getRowId(row) === id);
          return editedRow?.isNew
            ? prev.filter((row) => getRowId(row) !== id)
            : prev;
        });
      },
    [getRowId, markCanceled]
  );

  /**
   * Builds the onRowEditStop handler; see handleRowEditStop for events handled
   */
  const makeHandleRowEditStop = useCallback(
    ({ setRows, setRowModesModel }) =>
      (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
          event.defaultMuiPrevented = true;
          return;
        }
        if (params.reason === GridRowEditStopReasons.enterKeyDown) {
          event.defaultMuiPrevented = true;
        }
        if (params.reason === GridRowEditStopReasons.escapeKeyDown) {
          const id = getRowId(params.row);
          markCanceled(id);
          // Same as in makeHandleCancelClick: if the row is new, remove it from the rows state
          if (params.row.isNew) {
            setRows((prev) => prev.filter((row) => getRowId(row) !== id));
          }
          // Remove the row's entry from the rowModesModel to force out of edit mode
          setRowModesModel((prev) => {
            const { [id]: _, ...rest } = prev;
            return rest;
          });
        }
      },
    [getRowId, markCanceled]
  );

  /**
   * Build the model-change handler in the hook so it can reference canceled ids
   */
  const makeHandleRowModesModelChange = useCallback(
    (setRowModesModel) => (newModel) => {
      // Drop entries for rows that were just canceled
      const filtered = Object.fromEntries(
        Object.entries(newModel).filter(
          ([id]) => !canceledRowIds.current.has(id)
        )
      );
      setRowModesModel(filtered);
    },
    []
  );

  return {
    wasCanceled,
    makeHandleCancelClick,
    makeHandleRowEditStop,
    makeHandleRowModesModelChange,
  };
};
