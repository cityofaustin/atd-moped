import { GridRowEditStopReasons } from "@mui/x-data-grid-pro";

export const defaultEditColumnIconStyle = { fontSize: "24px" };

/**
 * Custom event handler for the DataGrid `onRowEditStop` that
 * prevents saving on Enter key press and deletes unsaved new rows on Escape.
 * @param {Array} rows - The current rows state
 * @param {Function} setRows - The rows state setter
 * @returns {Function} - A DataGrid `onRowEditStop` event handler
 */
export const handleRowEditStop = (rows, setRows) => (params, event) => {
  const id = params.row.id;
  if (params.reason === GridRowEditStopReasons.enterKeyDown) {
    event.defaultMuiPrevented = true;
  }
  if (params.reason === GridRowEditStopReasons.escapeKeyDown) {
    if (params.row.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  }
};

/**
 * Custom event handler for the DataGrid `onRowEditStop` event that
 * extends `handleRowEditStop` by also preventing save on click-away).
 * Example: Avoids saving the current row when the user clicks "Add" buttons.
 * @param {Array} rows - The current rows state
 * @param {Function} setRows - The rows state setter
 * @returns {Function} - A DataGrid `onRowEditStop` event handler
 */
export const handleRowEditStopPreventClickAway =
  (rows, setRows) => (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
      return;
    }
    handleRowEditStop(rows, setRows)(params, event);
  };

/**
 * Get lookup value for a given table using a record ID and returning a name
 * @param {Array|Object} lookupTable - Lookup table
 * @param {string} attribute - Prefix version of attribute name relying on the pattern of _id and _name
 * @param {number} id - ID used to find target record in lookup table
 * @return {string} - Name of attribute in the given row.
 */
export const getLookupValueByID = (lookupTable, attribute, id) => {
  if (!id) return null;

  return lookupTable.find((item) => item[`${attribute}_id`] === id)[
    `${attribute}_name`
  ];
};
