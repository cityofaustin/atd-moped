import React from "react";
import { TablePagination } from "@mui/material";

/**
 * Pagination Component
 * @param {GQLAbstract} query - The GQLAbstract class being passed down for reference
 * @param {Object} data - It's the GraphQL query results as provided by Apollo in the form of an array of objects.
 * @param {Object} pagination - The current state of Page
 * @param {func} setPagination - The method to use to update the state of Page
 * @return {JSX.Element}
 * @constructor
 */
const GridTablePagination = ({
  recordCount,
  queryLimit,
  setQueryLimit,
  queryOffset,
  setQueryOffset,
  rowsPerPageOptions,
}) => {
  /**
   * Handles Page Change (Next or Previous)
   * @param {Object} event - The object with event details
   * @param {integer} newPage - The actual page number as an integer
   */
  const handleChangePage = (event, newPage) => {
    // Calculate new offset
    const newOffset = newPage * queryLimit;
    // Update State
    setQueryOffset(newOffset);
  };

  /**
   * Handles the "Rows Per Page" change in the drop down menu
   * @param {Object} event - The object with event details
   */
  const handleChangeRowsPerPage = (event) => {
    // Transform the RowsPerPage number from string to integer, call it newLimit
    const newLimit = parseInt(event.target.value, 10);
    // Update state
    setQueryLimit(newLimit);
    setQueryOffset(0);
  };

  console.log({
    recordCount,
    queryLimit,
    setQueryLimit,
    queryOffset,
    setQueryOffset,
    rowsPerPageOptions,
  });

  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={recordCount}
      rowsPerPage={queryLimit}
      page={queryOffset / queryLimit}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default GridTablePagination;
