import { useEffect, useMemo, type RefObject } from "react";
import {
  type GridApi,
  type DataGridProProps,
  useGridApiRef,
  type GridRowIdGetter,
  type GridRowSelectionModel,
  type GridValidRowModel,
} from "@mui/x-data-grid-pro";
import { useSearchParams } from "react-router";

type UseDataGridRowHighlightParams<R extends GridValidRowModel> = {
  apiRef?: RefObject<GridApi | null>;
  getRowId?: GridRowIdGetter<R>;
  onCellClick?: DataGridProProps<R>["onCellClick"];
  rowSelectionModel?: GridRowSelectionModel;
  rows: readonly R[];
};

const HIGHLIGHTED_ROW_PARAM = "highlightedRowId";

const useDataGridRowHighlight = <R extends GridValidRowModel>({
  apiRef,
  getRowId,
  onCellClick,
  rowSelectionModel,
  rows,
}: UseDataGridRowHighlightParams<R>) => {
  const internalApiRef = useGridApiRef();
  const gridApiRef = apiRef ?? internalApiRef;
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightedRowId = searchParams.get(HIGHLIGHTED_ROW_PARAM);
  const highlightedRow = rows.find((row) => {
    const rowId = getRowId ? getRowId(row) : row.id;
    return String(rowId) === highlightedRowId;
  });
  const highlightedRowSelectionModel = useMemo<GridRowSelectionModel>(
    () =>
      highlightedRow
        ? {
            type: "include",
            ids: new Set([
              getRowId ? getRowId(highlightedRow) : highlightedRow.id,
            ]),
          }
        : (rowSelectionModel ?? { type: "include", ids: new Set() }),
    [getRowId, highlightedRow, rowSelectionModel],
  );

  useEffect(() => {
    if (
      highlightedRow === undefined ||
      gridApiRef.current === null
    ) {
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
  }, [getRowId, gridApiRef, highlightedRow]);

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
    highlightedRowId,
    rowSelectionModel: highlightedRowSelectionModel,
  };
};

export default useDataGridRowHighlight;
