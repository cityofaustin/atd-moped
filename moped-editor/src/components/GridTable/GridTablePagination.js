import React from "react";
import { TablePagination } from "@material-ui/core";

/**
 * GridTablePagination Component
 * @param {GQLAbstract} query - The GQLAbstract class being passed down for reference
 * @param {Object} data - It's the GraphQL query results as provided by Apollo in the form of an array of objects.
 * @param {Object} pagination - The current state of Page
 * @param {func} setPagination - The method to use to update the state of Page
 * @return {JSX.Element}
 * @constructor
 */
const GridTablePagination = ({ query, data, pagination, setPagination }) => {
  // Fetch the total number of records
  const aggregateDataCount =
    data[query.config.table + "_aggregate"].aggregate.count;

  /**
   * Handles Page Change (Next or Previous)
   * @param {Object} event - The object with event details
   * @param {integer} newPage - The actual page number as an integer
   */
  const handleChangePage = (event, newPage) => {
    // Calculate new offset
    const newOffset = newPage * pagination.limit;
    // Update query.offset and current pagination state
    query.offset = newOffset;
    // Update State
    setPagination({
      ...pagination, // Copy any previous values
      page: newPage, // Change state of page
      offset: query.offset, // Update state of offset
    });
  };

  /**
   * Handles the "Rows Per Page" change in the drop down menu
   * @param {Object} event - The object with event details
   */
  const handleChangeRowsPerPage = event => {
    // Transform the RowsPerPage number from string to integer, call it newLimit
    const newLimit = parseInt(event.target.value, 10);

    // Update the query's new limit, and reset offset
    query.limit = newLimit;
    query.offset = 0;
    // Update state
    setPagination({
      page: 0, // Back to first page
      limit: query.limit, // Update new limit to state
      offset: query.offset, // Reset state of offset back to zero
    });
  };

  return data ? (
    <TablePagination
      rowsPerPageOptions={query.config.pagination.rowsPerPageOptions}
      component="div"
      count={aggregateDataCount}
      rowsPerPage={pagination.limit}
      page={pagination.page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  ) : null;
};

export default GridTablePagination;
