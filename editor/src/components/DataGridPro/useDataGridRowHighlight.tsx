import { useEffect, useMemo, type RefObject } from "react";
import {
  type GridApi,
  type DataGridProProps,
  useGridApiRef,
  type GridRowIdGetter,
  type GridRowSelectionModel,
  type GridValidRowModel,
} from "@mui/x-data-grid-pro";
import { useLocation, useSearchParams } from "react-router";

type UseDataGridRowHighlightParams<R extends GridValidRowModel> = {
  apiRef?: RefObject<GridApi | null>;
  getRowId?: GridRowIdGetter<R>;
  highlightedRowParam?: string;
  onCellClick?: DataGridProProps<R>["onCellClick"];
  rowSelectionModel?: GridRowSelectionModel;
  rows: readonly R[];
};

const useDataGridRowHighlight = <R extends GridValidRowModel>({
  apiRef,
  getRowId,
  highlightedRowParam,
  onCellClick,
  rowSelectionModel,
  rows,
}: UseDataGridRowHighlightParams<R>) => {
  const internalApiRef = useGridApiRef();
  const gridApiRef = apiRef ?? internalApiRef;
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightedRowId = highlightedRowParam
    ? searchParams.get(highlightedRowParam)
    : null;
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
      const nextSearchParams = new URLSearchParams(searchParams);
      if (highlightedRowParam && nextSearchParams.has(highlightedRowParam)) {
        nextSearchParams.delete(highlightedRowParam);
        setSearchParams(nextSearchParams, { state: location.state });
      }
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
