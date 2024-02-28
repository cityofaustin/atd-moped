import React, { useState, useEffect, useContext, useCallback } from "react";
import { Box, Container, Paper } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useQuery } from "@apollo/client";
import Search from "../../../components/GridTable/Search";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import { DataGrid } from "@mui/x-data-grid";
import { useColumns } from "./helpers.js";
import { useHiddenColumnsSettings } from "src/utils/localStorageHelpers";
import { useGetProjectListView } from "./useProjectListViewQuery/useProjectListViewQuery";
import {
  PROJECT_LIST_VIEW_QUERY_CONFIG,
  DEFAULT_HIDDEN_COLS,
} from "./ProjectsListViewQueryConf";
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
import ProjectListToolbar from "./ProjectListToolbar";
import { useCurrentData } from "./useProjectListViewQuery/useCurrentData";

/**
 * GridTable Style
 */
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(1),
  },
  table: {
    minWidth: 750,
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

  const { hiddenColumns, setHiddenColumns } = useHiddenColumnsSettings({
    defaultHiddenColumnSettings: DEFAULT_HIDDEN_COLS,
    storageKey: "mopedProjectListColumnConfig",
  });

  const { columns, columnsToReturnInQuery } = useColumns({ hiddenColumns });

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

  const {
    data: projectListViewData,
    loading,
    error,
    refetch,
  } = useQuery(projectListViewQuery, {
    fetchPolicy: PROJECT_LIST_VIEW_QUERY_CONFIG.options.useQuery.fetchPolicy,
  });

  const data = useCurrentData(projectListViewData);

  const { handleExportButtonClick, dialogOpen } = useCsvExport({
    query: exportQuery,
    exportConfig: PROJECT_LIST_VIEW_EXPORT_CONFIG,
    queryTableName: PROJECT_LIST_VIEW_QUERY_CONFIG.table,
    fetchPolicy: PROJECT_LIST_VIEW_QUERY_CONFIG.options.useQuery.fetchPolicy,
    limit: queryLimit,
    setQueryLimit,
  });

  /**
   * Handles the header click for sorting asc/desc.
   * @param {Array.Object} sortModel, [{field, sort}]
   * Overrides a DataGrid sorting function
   * Clicking the sort arrow on a column will toggle between asc, desc, then reset
   * The Community version of DataGrid only supports sorting by one field, until we upgrade to Pro
   * we can expect only one item in the array
   **/
  const handleSortClick = useCallback(
    (sortModel) => {
      // Resets pagination offset to 0 when user clicks a header to display most relevant results
      setQueryOffset(0);

      if (sortModel.length > 0) {
        setOrderByColumn(sortModel[0]?.field);
        setOrderByDirection(sortModel[0]?.sort);
      } else {
        setOrderByColumn(PROJECT_LIST_VIEW_QUERY_CONFIG.order.defaultColumn);
        setOrderByDirection(
          PROJECT_LIST_VIEW_QUERY_CONFIG.order.defaultDirection
        );
      }
    },
    [setQueryOffset, setOrderByDirection, setOrderByColumn]
  );

  const handlePagination = useCallback(
    (paginationModel) => {
      setQueryLimit(paginationModel.pageSize);
      setQueryOffset(paginationModel.pageSize * paginationModel.page);
    },
    [setQueryLimit, setQueryOffset]
  );

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
          loading={loading}
        />
        {/*Main Table Body*/}
        <Paper className={classes.paper}>
          <Box
            sx={{
              height: "70vh",
              minHeight: "400px",
              marginTop: "14px",
            }}
          >
            {data && data.project_list_view && (
              <DataGrid
                // per the docs: When the height of a row is set to "auto", the final height will follow exactly
                // the content size and ignore the density. the docs recommend these styles in order to have density
                // along with get row height auto
                sx={{
                  "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
                    py: "8px",
                  },
                  "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
                    py: "15px",
                  },
                  "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
                    py: "22px",
                  },
                }}
                density="compact"
                getRowHeight={() => "auto"}
                columnVisibilityModel={hiddenColumns}
                onColumnVisibilityModelChange={(newModel) => {
                  setHiddenColumns(newModel);
                }}
                slots={{
                  toolbar: ProjectListToolbar,
                }}
                slotProps={{
                  columnsPanel: {
                    // Hiding buttons because when I toggle "show all" its only setting one column to visible
                    // instead of including every column in the object
                    disableShowAllButton: true,
                  },
                }}
                columns={columns}
                getRowId={(row) => row.project_id}
                disableRowSelectionOnClick
                rows={data.project_list_view}
                onSortModelChange={handleSortClick}
                disableColumnFilter
                paginationMode="server"
                paginationModel={{
                  page: queryOffset / queryLimit,
                  pageSize: queryLimit,
                }}
                onPaginationModelChange={handlePagination}
                rowCount={data.project_list_view_aggregate?.aggregate.count}
                pageSizeOptions={
                  PROJECT_LIST_VIEW_QUERY_CONFIG.pagination.rowsPerPageOptions
                }
              />
            )}
          </Box>
        </Paper>
      </Container>
    </ApolloErrorHandler>
  );
};

export default ProjectsListViewTable;
