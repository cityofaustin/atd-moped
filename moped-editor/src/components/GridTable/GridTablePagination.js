import React, { useEffect, useState } from "react";
import { TablePagination } from "@material-ui/core";

import { makeStyles, useTheme } from "@material-ui/core/styles";

// Styles
const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  disablePointerEvents: {
    "pointer-events": "none",
  },
}));

/**
 * GridTablePagination Component
 * @param {GQLAbstract} query - The GQLAbstract class being passed down for reference
 * @param {Object} data - It's the GraphQL query results as provided by Apollo in the form of an array of objects.
 * @param {func} updateQuery - The method to use to update the query
 * @return {JSX.Element}
 * @constructor
 */
const GridTablePagination = ({ query, updateQuery, data }) => {
  const classes = useStyles();
  const theme = useTheme();

  const aggregateDataCount =
    data[query.config.table + "_aggregate"].aggregate.count;

  /**
   * State Management
   */
  const [localQuery, setLocalQuery] = useState(query);
  const [limit, setLimit] = useState(query.config.limit);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    const rowsPerPage = parseInt(event.target.value, 10);
    localQuery.limit = rowsPerPage;
    setLimit(rowsPerPage);
    setLocalQuery(localQuery);
  };

  useEffect(() => {
    setOffset(page * limit);
  }, [page]);

  useEffect(() => {
    setPage(0);
  }, [limit]);

  useEffect(() => {
    localQuery.offset = offset;
    setLocalQuery(localQuery);
  }, [offset]);

  useEffect(() => {
    console.log("Updating query");
    updateQuery(localQuery);
  }, [localQuery]);

  return data ? (
    <TablePagination
      rowsPerPageOptions={localQuery.config.pagination.rowsPerPageOptions}
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
