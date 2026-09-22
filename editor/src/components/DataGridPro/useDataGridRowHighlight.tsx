import { useEffect, type RefObject } from "react";
import {
  type GridApi,
  useGridApiRef,
  type GridRowClassNameParams,
  type GridRowIdGetter,
  type GridValidRowModel,
} from "@mui/x-data-grid-pro";
import { useSearchParams } from "react-router";

type UseDataGridRowHighlightParams<R extends GridValidRowModel> = {
  apiRef?: RefObject<GridApi | null>;
  getRowClassName?: (params: GridRowClassNameParams<R>) => string;
  getRowId?: GridRowIdGetter<R>;
  rows: readonly R[];
};

const useDataGridRowHighlight = <R extends GridValidRowModel>({
  apiRef,
  getRowClassName,
  getRowId,
  rows,
}: UseDataGridRowHighlightParams<R>) => {
  const internalApiRef = useGridApiRef();
  const gridApiRef = apiRef ?? internalApiRef;
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightedRowLabel = "highlightedRowId";
  const highlightedRowId = searchParams.get(highlightedRowLabel);
  const highlightedRowStyle = {
    "& .moped-data-grid-highlighted-row": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  };

  useEffect(() => {
    if (highlightedRowId === null) {
      return;
    }

    const clearHighlight = () => {
      setSearchParams((currentSearchParams) => {
        if (!currentSearchParams.has(highlightedRowLabel)) {
          return currentSearchParams;
        }

        const nextSearchParams = new URLSearchParams(currentSearchParams);
        nextSearchParams.delete(highlightedRowLabel);
        return nextSearchParams;
      });
    };

    document.addEventListener("click", clearHighlight);
    return () => document.removeEventListener("click", clearHighlight);
  }, [highlightedRowId, setSearchParams]);

  useEffect(() => {
    if (
      highlightedRowId === null ||
      rows.length === 0 ||
      gridApiRef.current === null
    ) {
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
    const rowIndex = gridApiRef.current.getRowIndexRelativeToVisibleRows(rowId);

    // Scroll to the row and center it in the viewport
    if (rowIndex !== undefined && rowIndex >= 0) {
      gridApiRef.current.scrollToIndexes({ rowIndex });
      requestAnimationFrame(() => {
        gridApiRef.current?.getRowElement(rowId)?.scrollIntoView({
          block: "center",
        });
      });
    }
  }, [getRowId, gridApiRef, highlightedRowId, rows]);

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

  return {
    apiRef: gridApiRef,
    getRowClassNameWithHighlight,
    highlightedRowId,
    highlightedRowStyle,
  };
};

export default useDataGridRowHighlight;
