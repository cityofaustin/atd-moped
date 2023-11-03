import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";
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
  colorPrimary: {
    color: theme.palette.primary.main,
  },
}));

/**
 * Default column display (if no config in local storage)
 */
const DEFAULT_HIDDEN_COLS = {
  project_id: false,
  project_name: false,
  current_phase: false,
  project_team_members: true,
  project_lead: false,
  project_sponsor: false,
  project_partner: true,
  ecapris_subproject_id: false,
  updated_at: false,
  project_feature: true, // signal_ids
  task_orders: true,
  type_name: true,
  funding_source_name: true,
  project_note: true,
  construction_start_date: true,
  completion_end_date: true,
  project_inspector: true,
  project_designer: true,
  contractors: true,
  contract_numbers: true,
  project_tags: true,
  added_by: true,
  public_process_status: true,
  interim_project_id: true,
  children_project_ids: true,
  parent_project_id: true,
  components: true,
};

/**
 * Keeps localStorage column config in sync with UI interactions
 * @param {Object} column - the MT column config with the `field` prop - aka the column name
 * @param {Bool} hidden - the hidden state of the column
 */
const handleColumnChange = ({ field }, hidden) => {
  let storedConfig =
    JSON.parse(localStorage.getItem("mopedColumnConfig")) ??
    DEFAULT_HIDDEN_COLS;
  storedConfig = { ...storedConfig, [field]: hidden };
  localStorage.setItem("mopedColumnConfig", JSON.stringify(storedConfig));
};

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

  const [hiddenColumns, setHiddenColumns] = useState(
    JSON.parse(localStorage.getItem("mopedColumnConfig")) ?? DEFAULT_HIDDEN_COLS
  );

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

  const { filterQuery, filters, setFilters, advancedSearchWhereString } =
    useAdvancedSearch();

  const linkStateFilters = useMemo(() => {
    return Object.keys(filters).length ? btoa(JSON.stringify(filters)) : false;
  }, [filters]);

  const columns = useColumns({
    hiddenColumns,
    linkStateFilters,
    classes,
  });

  const columnsToReturn = Object.keys(PROJECT_LIST_VIEW_QUERY_CONFIG.columns);

  const { query: projectListViewQuery, exportQuery } = useGetProjectListView({
    columnsToReturn,
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
  /*
   * Store column configution before data change
   */
  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem("mopedColumnConfig"));
    if (storedConfig) {
      setHiddenColumns({...DEFAULT_HIDDEN_COLS, ...storedConfig });
    }
  }, [data]);

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
          filterQuery={filterQuery}
          advancedSearchAnchor={advancedSearchAnchor}
          setAdvancedSearchAnchor={setAdvancedSearchAnchor}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          queryConfig={PROJECT_LIST_VIEW_QUERY_CONFIG}
          filtersConfig={PROJECT_LIST_VIEW_FILTERS_CONFIG}
          handleExportButtonClick={handleExportButtonClick}
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
