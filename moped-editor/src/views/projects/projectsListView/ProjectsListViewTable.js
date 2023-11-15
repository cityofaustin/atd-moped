import React, { useState, useEffect, useContext, useCallback } from "react";
import { Box, Card, CircularProgress, Container, Paper } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useQuery } from "@apollo/client";
import Search from "../../../components/GridTable/Search";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import MaterialTable from "@material-table/core";
import { useTableComponents, useColumns, useTableOptions } from "./helpers.js";
import { useGetProjectListView } from "./useProjectListViewQuery/useProjectListViewQuery";
import { PROJECT_LIST_VIEW_QUERY_CONFIG } from "./ProjectsListViewQueryConf";
import { PROJECT_LIST_VIEW_FILTERS_CONFIG } from "./ProjectsListViewFiltersConf";
import { PROJECT_LIST_VIEW_EXPORT_CONFIG } from "./ProjectsListViewExportConf";
import { usePagination } from "./useProjectListViewQuery/usePagination";
import { useOrderBy } from "./useProjectListViewQuery/useOrderBy";
import { useSearch } from "./useProjectListViewQuery/useSearch";
import { useAdvancedSearch } from "./useProjectListViewQuery/useAdvancedSearch";
import ProjectListViewQueryContext from "src/components/QueryContextProvider";
import {
  useCsvExport,
  CsvDownloadDialog,
} from "./useProjectListViewQuery/useCsvExport";

/**
 * GridTable Style
 */
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& .MuiTableCell-head:nth-of-type(2)": {
      left: "0px",
      position: "sticky",
    },
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(1),
  },
  table: {
    minWidth: 750,
  },
  tableCell: {
    "text-transform": "capitalize",
    "white-space": "pre-wrap",
  },
  noResults: {
    paddingTop: "25px",
    paddingBottom: "16px",
  },
}));

/**
 * GridTable Search Capability plus Material Table
 * @param {Object} query - The GraphQL query configuration
 * @return {JSX.Element}
 * @constructor
 */
const ProjectsListViewTable = () => {
  const queryContext = useContext(ProjectListViewQueryContext);
  const classes = useStyles();
  // anchor element for advanced search popper in Search to "attach" to
  // State is handled here so we can listen for changes in a useeffect in this component
  const [advancedSearchAnchor, setAdvancedSearchAnchor] = useState(null);

  /* Project list query */
  const { queryLimit, setQueryLimit, queryOffset, setQueryOffset } =
    usePagination({
      defaultLimit: PROJECT_LIST_VIEW_QUERY_CONFIG.pagination.defaultLimit,
      defaultOffset: PROJECT_LIST_VIEW_QUERY_CONFIG.pagination.defaultOffset,
    });

  const {
    orderByColumn,
    setOrderByColumn,
    orderByDirection,
    setOrderByDirection,
  } = useOrderBy({
    defaultColumn: PROJECT_LIST_VIEW_QUERY_CONFIG.order.defaultColumn,
    defaultDirection: PROJECT_LIST_VIEW_QUERY_CONFIG.order.defaultDirection,
  });

  const { searchTerm, setSearchTerm, searchWhereString } = useSearch({
    queryConfig: PROJECT_LIST_VIEW_QUERY_CONFIG,
  });

  const { filters, setFilters, advancedSearchWhereString, isOr, setIsOr } =
    useAdvancedSearch();

  const { columns, setHiddenColumns, columnsToReturnInQuery } = useColumns();

  /**
   * Keeps localStorage column config in sync with UI interactions
   * @param {Object} column - the MT column config with the `field` prop - aka the column name
   * @param {Bool} hidden - the hidden state of the column
   */
  const handleColumnChange = ({ field }, hidden) => {
    setHiddenColumns((prevHiddenColumns) => ({
      ...prevHiddenColumns,
      [field]: hidden,
    }));
  };

  const { query: projectListViewQuery, exportQuery } = useGetProjectListView({
    columnsToReturn: columnsToReturnInQuery,
    exportColumnsToReturn: Object.keys(PROJECT_LIST_VIEW_EXPORT_CONFIG),
    exportConfig: PROJECT_LIST_VIEW_EXPORT_CONFIG,
    queryLimit,
    queryOffset,
    orderByColumn,
    orderByDirection,
    searchWhereString,
    advancedSearchWhereString,
  });

  const { data, error, refetch } = useQuery(projectListViewQuery, {
    fetchPolicy: PROJECT_LIST_VIEW_QUERY_CONFIG.options.useQuery.fetchPolicy,
  });

  const { handleExportButtonClick, dialogOpen } = useCsvExport({
    query: exportQuery,
    exportConfig: PROJECT_LIST_VIEW_EXPORT_CONFIG,
    queryTableName: PROJECT_LIST_VIEW_QUERY_CONFIG.table,
    fetchPolicy: PROJECT_LIST_VIEW_QUERY_CONFIG.options.useQuery.fetchPolicy,
    limit: queryLimit,
    setQueryLimit,
  });

  const tableOptions = useTableOptions({ queryLimit, data });

  const sortByColumnIndex = columns.findIndex(
    (column) => column.field === orderByColumn
  );

  /**
   * Handles the header click for sorting asc/desc.
   * @param {int} columnId
   * @param {string} newOrderDirection
   * Note: this is a GridTable function that we are using to override a Material Table sorting function
   * Their function call uses two variables, columnId and newOrderDirection. We only need the columnId
   **/
  const handleTableHeaderClick = useCallback(
    (columnId, newOrderDirection) => {
      const columnName = columns[columnId]?.field;

      // Resets pagination offset to 0 when user clicks a header to display most relevant results
      setQueryOffset(0);

      if (orderByColumn === columnName) {
        // If the current sortColumn is the same as the new
        // then invert values and repeat sort on column
        const direction = orderByDirection === "desc" ? "asc" : "desc";
        setOrderByDirection(direction);
      } else {
        // Sort different column in same order as previous column
        setOrderByColumn(columnName);
      }
    },
    [
      setQueryOffset,
      orderByColumn,
      orderByDirection,
      columns,
      setOrderByDirection,
      setOrderByColumn,
    ]
  );

  const tableComponents = useTableComponents({
    data,
    queryLimit,
    queryOffset,
    setQueryLimit,
    setQueryOffset,
    handleTableHeaderClick,
    sortByColumnIndex,
    orderByDirection,
    rowsPerPageOptions:
      PROJECT_LIST_VIEW_QUERY_CONFIG.pagination.rowsPerPageOptions,
  });

  /**
   * Store the most recent version of the query in app context so that it
   * can be refetched elswhere
   */
  useEffect(() => {
    queryContext.setListViewQuery(projectListViewQuery);
  }, [refetch, queryContext, projectListViewQuery]);

  return (
    <ApolloErrorHandler error={error}>
      <Container maxWidth={false} className={classes.root}>
        <CsvDownloadDialog dialogOpen={dialogOpen} />
        <Search
          parentData={data}
          filters={filters}
          setFilters={setFilters}
          advancedSearchAnchor={advancedSearchAnchor}
          setAdvancedSearchAnchor={setAdvancedSearchAnchor}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          queryConfig={PROJECT_LIST_VIEW_QUERY_CONFIG}
          filtersConfig={PROJECT_LIST_VIEW_FILTERS_CONFIG}
          handleExportButtonClick={handleExportButtonClick}
          isOr={isOr}
          setIsOr={setIsOr}
        />
        {/*Main Table Body*/}
        <Paper className={classes.paper}>
          <Box mt={3}>
            {!data && !error ? (
              <CircularProgress />
            ) : data && data.project_list_view ? (
              <Card className={classes.root}>
                <MaterialTable
                  onChangeColumnHidden={handleColumnChange}
                  data={data.project_list_view}
                  columns={columns}
                  title=""
                  options={tableOptions}
                  components={tableComponents}
                />
              </Card>
            ) : (
              <span>{error ? error : "Could not fetch data"}</span>
            )}
          </Box>
        </Paper>
      </Container>
    </ApolloErrorHandler>
  );
};

export default ProjectsListViewTable;
