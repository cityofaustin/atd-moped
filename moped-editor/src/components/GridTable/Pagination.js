import React from "react";
import { TablePagination } from "@mui/material";

/**
 * Pagination Component
 * @param {Number} recordCount - total number of records
 * @param {Number} queryLimit - limit of records per page
 * @param {Function} setQueryLimit - set the limit of records per page
 * @param {Number} offset - offset
 * @param {Function} setOffset - set offset
 * @param {Array} rowsPerPageOptions - array of numbers for rows per page
 * @return {JSX.Element}
 * @constructor
 */
const Pagination = ({
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

export default Pagination;
