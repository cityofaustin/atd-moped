import React, { useState, useEffect, useContext, useCallback } from "react";
import { Box, Container, Paper } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useQuery } from "@apollo/client";
import Search from "../../../components/GridTable/Search";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { useColumns } from "./helpers.js";
import { useHiddenColumnsSettings } from "src/utils/localStorageHelpers";
import { useGetProjectListView } from "./useProjectListViewQuery/useProjectListViewQuery";
import {
  PROJECT_LIST_VIEW_QUERY_CONFIG,
  DEFAULT_HIDDEN_COLS,
  SHOW_ALL_COLS,
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
  CsvDownloadingDialog,
  CsvDownloadOptionsDialog,
} from "./useProjectListViewQuery/useCsvExport";
import ProjectListToolbar from "./ProjectListToolbar";
import { useCurrentData } from "./useProjectListViewQuery/useCurrentData";
import dataGridProStyleOverrides from "src/styles/dataGridProStylesOverrides";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
  },
  table: {
    minWidth: 750,
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

  // States that handle the project list export button
  const [downloadOptionsDialogOpen, setDownloadOptionsDialogOpen] =
    useState(false);
  const [columnDownloadOption, setColumnDownloadOption] = useState("visible");
  const [downloadingDialogOpen, setDownloadingDialogOpen] = useState(false);

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

  const { columns, columnsToReturnInListView, visibleColumnsToReturnInExport } =
    useColumns({
      hiddenColumns,
    });

  const { query: projectListViewQuery } = useGetProjectListView({
    queryLimit: queryLimit,
    queryOffset: queryOffset,
    columnsToReturn: columnsToReturnInListView,
    orderByColumn: orderByColumn,
    orderByDirection: orderByDirection,
    searchWhereString: searchWhereString,
    advancedSearchWhereString: advancedSearchWhereString,
    queryName: "ProjectListView",
  });

  const { query: exportQuery } = useGetProjectListView({
    columnsToReturn:
      columnDownloadOption === "visible"
        ? visibleColumnsToReturnInExport
        : Object.keys(PROJECT_LIST_VIEW_EXPORT_CONFIG),
    orderByColumn: orderByColumn,
    orderByDirection: orderByDirection,
    searchWhereString: searchWhereString,
    advancedSearchWhereString: advancedSearchWhereString,
    queryName: "ProjectListExport",
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

  const {
    handleExportButtonClick,
    handleRadioSelect,
    handleContinueButtonClick,
    handleOptionsDialogClose,
  } = useCsvExport({
    query: exportQuery,
    exportConfig: PROJECT_LIST_VIEW_EXPORT_CONFIG,
    queryTableName: PROJECT_LIST_VIEW_QUERY_CONFIG.table,
    setDownloadOptionsDialogOpen: setDownloadOptionsDialogOpen,
    columnDownloadOption: columnDownloadOption,
    setColumnDownloadOption: setColumnDownloadOption,
    setDownloadingDialogOpen: setDownloadingDialogOpen,
    visibleColumns: visibleColumnsToReturnInExport,
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
        <CsvDownloadOptionsDialog
          dialogOpen={downloadOptionsDialogOpen}
          handleDialogClose={handleOptionsDialogClose}
          handleContinueButtonClick={handleContinueButtonClick}
          handleRadioSelect={handleRadioSelect}
          columnDownloadOption={columnDownloadOption}
        />
        <CsvDownloadingDialog downloadingDialogOpen={downloadingDialogOpen} />
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
              height: "75vh",
              minHeight: "400px",
              marginTop: "14px",
            }}
          >
            {data && data.project_list_view && (
              <DataGridPro
                sx={dataGridProStyleOverrides}
                density="compact"
                getRowHeight={() => "auto"}
                columnVisibilityModel={hiddenColumns}
                onColumnVisibilityModelChange={(newModel) => {
                  // when someone toggles "show all columns", datagrid's model is an empty object
                  if (Object.keys(newModel).length > 0) {
                    setHiddenColumns(newModel);
                  } else {
                    setHiddenColumns(SHOW_ALL_COLS);
                  }
                }}
                slots={{
                  toolbar: ProjectListToolbar,
                }}
                columns={columns}
                getRowId={(row) => row.project_id}
                disableRowSelectionOnClick
                rows={data.project_list_view}
                onSortModelChange={handleSortClick}
                disableColumnFilter
                pagination
                paginationMode="server"
                localeText={{ noRowsLabel: "No projects found." }}
                paginationModel={{
                  page: queryOffset / queryLimit,
                  pageSize: queryLimit,
                }}
                onPaginationModelChange={handlePagination}
                rowCount={data.project_list_view_aggregate?.aggregate.count}
                pageSizeOptions={
                  PROJECT_LIST_VIEW_QUERY_CONFIG.pagination.rowsPerPageOptions
                }
                sortingMode="server"
              />
            )}
          </Box>
        </Paper>
      </Container>
    </ApolloErrorHandler>
  );
};

export default ProjectsListViewTable;
