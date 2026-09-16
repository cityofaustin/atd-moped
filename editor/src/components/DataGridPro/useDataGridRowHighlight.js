import { useEffect } from "react";
import { useSearchParams } from "react-router";

const useDataGridRowHighlight = ({
  apiRef,
  getRowClassName,
  getRowId,
  highlightRowParam,
  rows,
}) => {
  const [searchParams] = useSearchParams();
  const highlightedRowId = highlightRowParam
    ? searchParams.get(highlightRowParam)
    : null;

  useEffect(() => {
    if (highlightedRowId === null || rows.length === 0) {
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
        apiRef.current.getRowElement(rowId)?.scrollIntoView({
          block: "center",
        });
      });
    }
  }, [apiRef, getRowId, highlightedRowId, rows]);

  const getRowClassNameWithHighlight = (params) => {
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
