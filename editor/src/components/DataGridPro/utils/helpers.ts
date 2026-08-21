import {
  GridRowEditStopReasons,
  GridRowModes,
  type GridRowModesModel,
  type GridEventListener,
  type GridValidRowModel,
} from "@mui/x-data-grid-pro";
import type { Dispatch, SetStateAction } from "react";

export const defaultEditColumnIconStyle = { fontSize: "24px" };

/**
 * Checks if a DataGrid inline edit input is empty to initialize validation state
 * as invalid; an empty required field is not valid no matter the data type
 * @param value - value of input
 * @returns True if the value is empty
 */
export const isEmpty = (value: unknown) => {
  if (value === null || value === undefined) return true;
  // Strings
  if (typeof value === "string") return value.trim() === "";
  // Number (excluding NaN)
  if (typeof value === "number") return Number.isNaN(value);
  // Check for array and date first since they are also objects
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Date) return Number.isNaN(value.getTime());
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};

/**
 * Custom event handler for the DataGrid `onRowEditStop` event that:
 * 1. Prevents saving on Enter key press
 * 2. Prevents saving on click-away
 * 3. Deletes unsaved new rows on Escape
 * @param rows - The current rows state
 * @param setRows - The rows state setter
 */
export const handleRowEditStop =
  <R extends GridValidRowModel & { id: string | number; isNew?: boolean }>(
    rows: R[],
    setRows: Dispatch<SetStateAction<R[]>>
  ): GridEventListener<"rowEditStop"> =>
  (params, event) => {
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
 * @param rowModesModel - The row modes model from the DataGrid
 * @returns True if any row is in edit mode, false otherwise
 */
export const getIsEditMode = (rowModesModel: GridRowModesModel) =>
  Object.values(rowModesModel).some((m) => m.mode === GridRowModes.Edit);
