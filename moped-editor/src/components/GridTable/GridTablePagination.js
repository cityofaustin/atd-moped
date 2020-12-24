import React, { useEffect, useState } from "react";
import { TablePagination } from "@material-ui/core";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { expandEnvs } from "env-cmd/dist/expand-envs";

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
 * @param {number} itemsPerPage - The initial number of items per single page
 * @return {JSX.Element}
 * @constructor
 */
const GridTablePagination = ({ query, data }) => {

  const classes = useStyles();
  const theme = useTheme();

  const aggregateDataCount =
    data[query.config.table + "_aggregate"].aggregate.count;

  const getTotalPages = limit => Math.ceil(aggregateDataCount / limit);

  /**
   * State Management
   */
  const [limit, setLimit] = useState(query.config.limit);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    const rowsPerPage = parseInt(event.target.value, 10);
    query.limit = rowsPerPage;
    setLimit(rowsPerPage);
  };

  useEffect(() => {
    setOffset(page * limit);
  }, [page]);

  useEffect(() => {
    setPage(0);
  }, [limit]);

  useEffect(() => {
    query.offset = offset;
  }, [offset]);

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
