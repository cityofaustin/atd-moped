import { createContext } from "react";
import type { GridSlotsComponent } from "@mui/x-data-grid-pro";

type MopedDataGridRowClickAwayContextValue = {
  highlightedRowId: string | null;
  onHighlightedRowClickAway?: () => void;
  rowComponent?: GridSlotsComponent["row"];
};

const MopedDataGridRowClickAwayContext =
  createContext<MopedDataGridRowClickAwayContextValue>({
    highlightedRowId: null,
  });

export default MopedDataGridRowClickAwayContext;
