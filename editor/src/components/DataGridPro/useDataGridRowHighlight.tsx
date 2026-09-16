import { useEffect } from "react";
import {
  type GridApi,
  type GridRowClassNameParams,
  type GridRowIdGetter,
  type GridValidRowModel,
} from "@mui/x-data-grid-pro";
import { useSearchParams } from "react-router";

type UseDataGridRowHighlightParams<R extends GridValidRowModel> = {
  apiRef: React.RefObject<GridApi | null>;
  getRowClassName?: (params: GridRowClassNameParams<R>) => string;
  getRowId?: GridRowIdGetter<R>;
  highlightRowParam?: string;
  rows: readonly R[];
};

const useDataGridRowHighlight = <R extends GridValidRowModel>({
  apiRef,
  getRowClassName,
  getRowId,
  highlightRowParam,
  rows,
}: UseDataGridRowHighlightParams<R>) => {
  const [searchParams] = useSearchParams();
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

  return { getRowClassNameWithHighlight, highlightedRowId };
};

export default useDataGridRowHighlight;
