import { useEffect, type RefObject } from "react";
import {
  type GridApi,
  type DataGridProProps,
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
  onCellClick?: DataGridProProps<R>["onCellClick"];
  rows: readonly R[];
};

const HIGHLIGHTED_ROW_PARAM = "highlightedRowId";

const useDataGridRowHighlight = <R extends GridValidRowModel>({
  apiRef,
  getRowClassName,
  getRowId,
  onCellClick,
  rows,
}: UseDataGridRowHighlightParams<R>) => {
  const internalApiRef = useGridApiRef();
  const gridApiRef = apiRef ?? internalApiRef;
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightedRowId = searchParams.get(HIGHLIGHTED_ROW_PARAM);
  const highlightedRowStyle = {
    "& .moped-data-grid-highlighted-row": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  };

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

  const handleCellClick: NonNullable<
    DataGridProProps<R>["onCellClick"]
  > = (params, event, details) => {
    if (highlightedRowId !== null) {
      setSearchParams((currentSearchParams) => {
        if (!currentSearchParams.has(HIGHLIGHTED_ROW_PARAM)) {
          return currentSearchParams;
        }

        const nextSearchParams = new URLSearchParams(currentSearchParams);
        nextSearchParams.delete(HIGHLIGHTED_ROW_PARAM);
        return nextSearchParams;
      });
    }

    onCellClick?.(params, event, details);
  };

  return {
    apiRef: gridApiRef,
    handleCellClick,
    getRowClassNameWithHighlight,
    highlightedRowId,
    highlightedRowStyle,
  };
};

export default useDataGridRowHighlight;
