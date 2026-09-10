import { DataGridPro, useGridApiRef } from "@mui/x-data-grid-pro";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";

/**
 * DataGridPro wrapper with default styles and props to ensure consistent styling and behavior of data grids
 * @param {object} sx - additional style overrides to be applied on top of default styles, optional
 * @param {object} props - other props to be passed to DataGridPro component
 * @returns {JSX.Element}
 */
const MopedDataGrid = ({
  sx,
  slotProps = {},
  getRowClassName,
  getRowId,
  highlightRowParam,
  apiRef,
  rows = [],
  ...props
}) => {
  const [searchParams] = useSearchParams();
  const internalApiRef = useGridApiRef();
  const gridApiRef = apiRef ?? internalApiRef;
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
    const rowIndex =
      gridApiRef.current.getRowIndexRelativeToVisibleRows(rowId);

    if (rowIndex !== undefined && rowIndex >= 0) {
      gridApiRef.current.scrollToIndexes({ rowIndex });
      requestAnimationFrame(() => {
        gridApiRef.current.getRowElement(rowId)?.scrollIntoView({
          block: "center",
        });
      });
    }
  }, [getRowId, gridApiRef, highlightedRowId, rows]);

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

  // TO DO: refactor the functions below before upgrading to MUI v9
  const mergedRootSx = {
    ...dataGridProStyleOverrides,
    ...sx,
    ...(slotProps.root?.sx || {}),
    ...(highlightedRowId !== null && {
      "& .moped-data-grid-highlighted-row": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
    }),
  };

  const mergedSlotProps = {
    ...slotProps,
    loadingOverlay: {
      variant: "circular-progress",
      noRowsVariant: "circular-progress",
    },
    root: {
      ...(slotProps.root || {}),
      sx: mergedRootSx,
    },
  };

  return (
    <DataGridPro
      slotProps={mergedSlotProps}
      density="comfortable"
      getRowHeight={() => "auto"}
      getRowClassName={getRowClassNameWithHighlight}
      hideFooter
      disableRowSelectionOnClick
      // Show toolbar if a toolbar slot is provided
      showToolbar={!!props.slots?.toolbar}
      onProcessRowUpdateError={(error) => console.error(error)}
      getRowId={getRowId}
      apiRef={gridApiRef}
      rows={rows}
      {...props}
    />
  );
};

export default MopedDataGrid;
