import React, { useEffect } from "react";
import {
  type GridApi,
  type DataGridProProps,
  type GridRowClassNameParams,
  type GridRowIdGetter,
  type GridValidRowModel,
} from "@mui/x-data-grid-pro";
import { useSearchParams } from "react-router";

type HighlightEventHandlers<R extends GridValidRowModel> = Pick<
  DataGridProProps<R>,
  "onCellClick" | "onCellDoubleClick" | "onCellEditStart" | "onRowEditStart"
>;
type CellClickHandler<R extends GridValidRowModel> = NonNullable<
  DataGridProProps<R>["onCellClick"]
>;
type CellDoubleClickHandler<R extends GridValidRowModel> = NonNullable<
  DataGridProProps<R>["onCellDoubleClick"]
>;
type CellEditStartHandler<R extends GridValidRowModel> = NonNullable<
  DataGridProProps<R>["onCellEditStart"]
>;
type RowEditStartHandler<R extends GridValidRowModel> = NonNullable<
  DataGridProProps<R>["onRowEditStart"]
>;

type UseDataGridRowHighlightParams<R extends GridValidRowModel> = {
  apiRef: React.RefObject<GridApi | null>;
  eventHandlers: HighlightEventHandlers<R>;
  getRowClassName?: (params: GridRowClassNameParams<R>) => string;
  getRowId?: GridRowIdGetter<R>;
  highlightRowParam?: string;
  rows: readonly R[];
};

const useDataGridRowHighlight = <R extends GridValidRowModel>({
  apiRef,
  eventHandlers,
  getRowClassName,
  getRowId,
  highlightRowParam,
  rows,
}: UseDataGridRowHighlightParams<R>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightedRowId = highlightRowParam
    ? searchParams.get(highlightRowParam)
    : null;

  useEffect(() => {
    if (highlightedRowId === null || rows.length === 0 || apiRef.current === null) {
      return;
    }

    const highlightedRow = rows.find((row) => {
      const rowId = getRowId ? getRowId(row) : row.id;
      return String(rowId) === highlightedRowId;
    });

    if (!highlightedRow) {
      return;
    }

    const rowId = getRowId ? getRowId(highlightedRow) : highlightedRow.id;
    const rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(rowId);

    if (rowIndex !== undefined && rowIndex >= 0) {
      apiRef.current.scrollToIndexes({ rowIndex });
      requestAnimationFrame(() => {
        apiRef.current?.getRowElement(rowId)?.scrollIntoView({
          block: "center",
        });
      });
    }
  }, [apiRef, getRowId, highlightedRowId, rows]);

  const getRowClassNameWithHighlight = (params: GridRowClassNameParams<R>) => {
    const rowId = getRowId ? getRowId(params.row) : params.row.id;
    const rowClassName = getRowClassName?.(params) || "";

    return [
      rowClassName,
      highlightedRowId !== null && String(rowId) === highlightedRowId
        ? "moped-data-grid-highlighted-row"
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const clearHighlightForRow = (rowId: string | number) => {
    if (
      highlightRowParam &&
      highlightedRowId !== null &&
      String(rowId) !== highlightedRowId
    ) {
      setSearchParams((currentSearchParams) => {
        const nextSearchParams = new URLSearchParams(currentSearchParams);
        nextSearchParams.delete(highlightRowParam);
        return nextSearchParams;
      });
    }
  };

  const handleCellEditStart: CellEditStartHandler<R> = (
    params,
    event,
    details,
  ) => {
    clearHighlightForRow(params.id);
    eventHandlers.onCellEditStart?.(params, event, details);
  };

  const handleCellDoubleClick: CellDoubleClickHandler<R> = (
    params,
    event,
    details,
  ) => {
    clearHighlightForRow(params.id);
    eventHandlers.onCellDoubleClick?.(params, event, details);
  };

  const handleCellClick: CellClickHandler<R> = (
    params,
    event,
    details,
  ) => {
    if (params.field === "_edit" || params.field === "edit") {
      clearHighlightForRow(params.id);
    }
    eventHandlers.onCellClick?.(params, event, details);
  };

  const handleRowEditStart: RowEditStartHandler<R> = (
    params,
    event,
    details,
  ) => {
    clearHighlightForRow(params.id);
    eventHandlers.onRowEditStart?.(params, event, details);
  };

  return {
    getRowClassNameWithHighlight,
    highlightedRowId,
    eventHandlers: {
      onCellClick: handleCellClick,
      onCellDoubleClick: handleCellDoubleClick,
      onCellEditStart: handleCellEditStart,
      onRowEditStart: handleRowEditStart,
    },
  };
};

export default useDataGridRowHighlight;
