import { GridRowEditStopReasons } from "@mui/x-data-grid-pro";

export const defaultEditColumnIconStyle = { fontSize: "24px" };

export const handleRowEditStop = (params, event) => {
  if (params.reason === GridRowEditStopReasons.enterKeyDown) {
    event.defaultMuiPrevented = true;
  }
};
