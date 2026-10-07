import ClickAwayListener from "@mui/material/ClickAwayListener";
import {
  GridRow,
  type GridRowProps,
  type GridSlotsComponent,
} from "@mui/x-data-grid-pro";

declare module "@mui/x-data-grid-pro" {
  interface RowPropsOverrides {
    highlightedRowId?: string | null;
    onHighlightedRowClickAway?: () => void;
    rowComponent?: GridSlotsComponent["row"];
  }
}

type MopedDataGridRowClickAwayListenerProps = GridRowProps & {
  highlightedRowId?: string | null;
  onHighlightedRowClickAway?: () => void;
  rowComponent?: GridSlotsComponent["row"];
};

function MopedDataGridRowClickAwayListener({
  highlightedRowId,
  onHighlightedRowClickAway,
  rowComponent: Row = GridRow,
  ...rowProps
}: MopedDataGridRowClickAwayListenerProps) {
  const row = <Row {...rowProps} />;

  if (
    highlightedRowId === null ||
    highlightedRowId === undefined ||
    String(rowProps.rowId) !== highlightedRowId ||
    !onHighlightedRowClickAway
  ) {
    return row;
  }

  return (
    <ClickAwayListener onClickAway={onHighlightedRowClickAway}>
      {row}
    </ClickAwayListener>
  );
}

export default MopedDataGridRowClickAwayListener;
