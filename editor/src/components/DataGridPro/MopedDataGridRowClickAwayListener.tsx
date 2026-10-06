import React, { createElement, forwardRef } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { GridRow, type GridRowProps } from "@mui/x-data-grid-pro";

declare module "@mui/x-data-grid-pro" {
  interface RowPropsOverrides {
    highlightedRowId?: string | null;
    onHighlightedRowClickAway?: () => void;
    rowComponent?: React.ElementType<GridRowProps>;
  }
}

type MopedDataGridRowClickAwayListenerProps = GridRowProps & {
  highlightedRowId?: string | null;
  onHighlightedRowClickAway?: () => void;
  rowComponent?: React.ElementType<GridRowProps>;
};

const MopedDataGridRowClickAwayListener = forwardRef<
  HTMLDivElement,
  MopedDataGridRowClickAwayListenerProps
>(function MopedDataGridRowClickAwayListener(
  {
    highlightedRowId,
    onHighlightedRowClickAway,
    rowComponent = GridRow,
    ...rowProps
  },
  ref
) {
  const row =
    rowComponent === GridRow
      ? createElement(GridRow, {
          ...rowProps,
          ref,
        } as GridRowProps & React.RefAttributes<HTMLDivElement>)
      : createElement(rowComponent, rowProps);

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
});

export default MopedDataGridRowClickAwayListener;
