import React, { useState, useEffect, useContext, useCallback } from "react";
import { Box, Card, CircularProgress, Container, Paper } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useQuery } from "@apollo/client";
import Search from "../../../components/GridTable/Search";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import MaterialTable from "@material-table/core";
import {
  useTableComponents,
  useColumns,
  useTableOptions,
  useHiddenColumnsSettings,
} from "./helpers.js";
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
import { useCurrentData } from "./useProjectListViewQuery/useCurrentData";
import { DataGrid } from "@mui/x-data-grid";

const COLUMN_WIDTHS = {
  small: 75,
  medium: 200,
  large: 250,
  xlarge: 350,
};

/**
 * GridTable Style
 */
const useStyles = makeStyles((theme) => ({
  root: {},

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

  const { hiddenColumns, setHiddenColumns } = useHiddenColumnsSettings();

  const { columns, columnsToReturnInQuery } = useColumns({ hiddenColumns });

  /**
   * Keeps localStorage column config in sync with UI interactions
   * @param {Object} column - the MT column config with the `field` prop - aka the column name
   * @param {Bool} hidden - the hidden state of the column
   */
  const handleColumnChange = useCallback(
    ({ field }, hidden) => {
      setHiddenColumns((prevHiddenColumns) => ({
        ...prevHiddenColumns,
        [field]: hidden,
      }));
    },
    [setHiddenColumns]
  );

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
    loading,
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
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <CsvDownloadDialog dialogOpen={dialogOpen} />
        <Box>
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
        </Box>
        {/*Main Table Body*/}

        <Box sx={{ flexGrow: 1, height: "1px" }}>
          {data && data.project_list_view && (
            <DataGrid
              columns={[
                {
                  headerName: "ID",
                  field: "project_id",
                  width: COLUMN_WIDTHS.small,
                },
                {
                  headerName: "Name",
                  field: "project_name",
                  flex: 2,
                  minWidth: COLUMN_WIDTHS.xlarge,
                },
                {
                  headerName: "project_team_members",
                  field: "project_team_members",
                  flex: 1,
                  minWidth: COLUMN_WIDTHS.medium,
                },
                {
                  headerName: "project_lead",
                  field: "project_lead",
                  flex: 1,
                  minWidth: COLUMN_WIDTHS.medium,
                },
                {
                  headerName: "project_sponsor",
                  field: "project_sponsor",
                  flex: 1,
                  minWidth: COLUMN_WIDTHS.medium,
                },
                {
                  headerName: "current_phase_key",
                  field: "current_phase_key",
                  flex: 1,
                  minWidth: COLUMN_WIDTHS.medium,
                },
                {
                  headerName: "ecapris_subproject_id",
                  field: "ecapris_subproject_id",
                  flex: 1,
                  minWidth: COLUMN_WIDTHS.medium,
                },
                {
                  headerName: "updated_at",
                  field: "updated_at",
                  flex: 1,
                  minWidth: COLUMN_WIDTHS.medium,
                },
                {
                  headerName: "components",
                  field: "components",
                  flex: 1,
                  minWidth: COLUMN_WIDTHS.medium,
                },
              ]}
              getRowId={(thing) => thing.project_id}
              disableRowSelectionOnClick
              rows={data.project_list_view}
            />
          )}
        </Box>
      </Box>
    </ApolloErrorHandler>
  );
};

export default ProjectsListViewTable;
