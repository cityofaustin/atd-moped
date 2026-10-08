import { useContext } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { GridRow, type GridRowProps } from "@mui/x-data-grid-pro";
import MopedDataGridRowClickAwayContext from "./MopedDataGridRowClickAwayContext";

function MopedDataGridRowClickAwayListener({ ...rowProps }: GridRowProps) {
  const {
    highlightedRowId,
    onHighlightedRowClickAway,
    rowComponent: Row = GridRow,
  } = useContext(MopedDataGridRowClickAwayContext);
  const row = <Row {...rowProps} />;

  if (
    highlightedRowId === null ||
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
