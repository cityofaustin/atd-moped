import { GridRowEditStopReasons } from "@mui/x-data-grid-pro";

export const defaultEditColumnIconStyle = { fontSize: "24px" };

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
