import React, { useEffect } from "react";
import { TablePagination } from "@material-ui/core";

/**
 * GridTablePagination Component
 * @param {GQLAbstract} query - The GQLAbstract class being passed down for reference
 * @param {Object} data - It's the GraphQL query results as provided by Apollo in the form of an array of objects.
 * @param {integer} page - The current state of Page
 * @param {func} setPage - The method to use to update the state of Page
 * @param {int} limit - The current state of Limit
 * @param {func} setLimit - The method to use to update the state of Limit
 * @param {int} offset - The current state of offset
 * @param {func} setOffset - The method to use to update the state of Offset
 * @return {JSX.Element}
 * @constructor
 */
const GridTablePagination = ({
  query,
  data,
  page,
  setPage,
  limit,
  setLimit,
  offset,
  setOffset,
}) => {
  const aggregateDataCount =
    data[query.config.table + "_aggregate"].aggregate.count;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    const rowsPerPage = parseInt(event.target.value, 10);
    setPage(0);
    query.limit = rowsPerPage;
    setLimit(rowsPerPage);
  };

  useEffect(() => {
    const offsetUpdate = page * query.limit;
    query.offset = offsetUpdate;
    setOffset(offsetUpdate);
  }, [page, query.offset, query.limit, setOffset]);

  /**
   * Make sure we don't go below 0 for offset
   */
  if (offset < 0) {
    setOffset(0);
  }

  return data ? (
    <TablePagination
      rowsPerPageOptions={query.config.pagination.rowsPerPageOptions}
      component="div"
      count={aggregateDataCount}
      rowsPerPage={limit}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  ) : null;
};

export default GridTablePagination;
