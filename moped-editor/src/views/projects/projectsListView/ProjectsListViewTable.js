import React, { useState, useEffect, useMemo } from "react";
import { NavLink as RouterLink } from "react-router-dom";

import { Box, Card, CircularProgress, Container, Paper } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";
import typography from "../../../theme/typography";

import { useQuery } from "@apollo/client";
import Search from "../../../components/GridTable/Search";
import Pagination from "../../../components/GridTable/Pagination";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectStatusBadge from "./../projectView/ProjectStatusBadge";
import ExternalLink from "../../../components/ExternalLink";
import RenderSignalLink from "../signalProjectTable/RenderSignalLink";

import MaterialTable, { MTableHeader } from "@material-table/core";
import { filterProjectTeamMembers as renderProjectTeamMembers } from "./helpers.js";
import { formatDateType, formatTimeStampTZType } from "src/utils/dateAndTime";
import parse from "html-react-parser";
import { useGetProjectListView } from "./useProjectListViewQuery/useProjectListViewQuery";
import { PROJECT_LIST_VIEW_QUERY_CONFIG } from "./ProjectsListViewQueryConf";
import { PROJECT_LIST_VIEW_FILTERS_CONFIG } from "./ProjectsListViewFiltersConf";
import { PROJECT_LIST_VIEW_EXPORT_CONFIG } from "./ProjectsListViewExportConf";
import { usePagination } from "./useProjectListViewQuery/usePagination";
import { useOrderBy } from "./useProjectListViewQuery/useOrderBy";
import { useSearch } from "./useProjectListViewQuery/useSearch";
import { useAdvancedSearch } from "./useProjectListViewQuery/useAdvancedSearch";
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
  task_order: true,
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
 * Returns a ProjectStatusBadge component based on the status and phase of project
 * @param {string} phase - A project's current phase
 * @param {number} statusId - Project's status id
 * @return {JSX.Element}
 */
const buildStatusBadge = ({ phaseName, phaseKey }) => (
  <ProjectStatusBadge phaseName={phaseName} phaseKey={phaseKey} condensed />
);

/**
 * GridTable Search Capability plus Material Table
 * @param {Object} query - The GraphQL query configuration
 * @return {JSX.Element}
 * @constructor
 */
const ProjectsListViewTable = () => {
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

  const columns = [
    {
      title: "ID",
      field: "project_id",
      hidden: hiddenColumns["project_id"],
    },
    {
      title: "Name",
      field: "project_name",
      hidden: hiddenColumns["project_name"],
      render: (entry) => (
        <RouterLink
          to={`/moped/projects/${entry.project_id}`}
          state={{ filters: linkStateFilters }}
          className={classes.colorPrimary}
        >
          {entry.project_name}
        </RouterLink>
      ),
      cellStyle: {
        position: "sticky",
        left: 0,
        backgroundColor: "white",
        minWidth: "20rem",
        zIndex: 1,
      },
    },
    {
      title: "Status",
      field: "current_phase",
      hidden: hiddenColumns["current_phase"],
      render: (entry) =>
        buildStatusBadge({
          phaseName: entry.current_phase,
          phaseKey: entry.current_phase_key,
        }),
    },
    {
      title: "Team",
      field: "project_team_members",
      hidden: hiddenColumns["project_team_members"],
      cellStyle: { whiteSpace: "noWrap" },
      render: (entry) =>
        renderProjectTeamMembers(
          entry.project_team_members,
          "projectsListView"
        ),
    },
    {
      title: "Lead",
      field: "project_lead",
      hidden: hiddenColumns["project_lead"],
      editable: "never",
      cellStyle: { whiteSpace: "noWrap" },
      render: (entry) =>
        entry.project_lead === null ? "-" : entry.project_lead,
    },
    {
      title: "Sponsor",
      field: "project_sponsor",
      hidden: hiddenColumns["project_sponsor"],
      editable: "never",
      cellStyle: { whiteSpace: "noWrap" },
      render: (entry) =>
        entry.project_sponsor === "None" ? "-" : entry.project_sponsor,
    },
    {
      title: "Partners",
      field: "project_partner",
      hidden: hiddenColumns["project_partner"],
      emptyValue: "-",
      cellStyle: { whiteSpace: "noWrap" },
      render: (entry) => {
        return entry.project_partner.split(",").map((partner) => (
          <span key={partner} style={{ display: "block" }}>
            {partner}
          </span>
        ));
      },
    },
    {
      title: "eCAPRIS ID",
      field: "ecapris_subproject_id",
      hidden: hiddenColumns["ecapris_subproject_id"],
      render: (entry) => (
        <ExternalLink
          text={entry.ecapris_subproject_id}
          url={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${entry.ecapris_subproject_id}`}
        />
      ),
    },
    {
      title: "Modified",
      field: "updated_at",
      hidden: hiddenColumns["updated_at"],
      render: (entry) => formatTimeStampTZType(entry.updated_at),
    },
    {
      title: "Signal IDs",
      field: "project_feature",
      hidden: hiddenColumns["project_feature"],
      sorting: false,
      render: (entry) => {
        if (!entry?.project_feature) {
          return "-";
        } else {
          const signals = entry.project_feature.filter(
            (signal) => signal.signal_id && signal.knack_id
          );
          return <RenderSignalLink signals={signals} />;
        }
      },
    },
    {
      title: "Task order",
      field: "task_orders",
      hidden: hiddenColumns["task_order"],
      cellStyle: { whiteSpace: "noWrap" },
      emptyValue: "-",
      render: (entry) => {
        // Empty value won't work in some cases where task_order is an empty array.
        if (entry?.task_orders.length < 1) {
          return "-";
        }
        // Render values as a comma seperated string
        return entry.task_orders.map((taskOrder) => (
          <span key={taskOrder.task_order} style={{ display: "block" }}>
            {taskOrder.display_name}
          </span>
        ));
      },
    },
    {
      title: "Type",
      field: "type_name",
      hidden: hiddenColumns["type_name"],
      emptyValue: "-",
      cellStyle: { whiteSpace: "noWrap" },
      render: (entry) => {
        return entry.type_name.split(",").map((type_name) => (
          <span key={type_name} style={{ display: "block" }}>
            {type_name}
          </span>
        ));
      },
    },
    {
      title: "Funding",
      field: "funding_source_name",
      hidden: hiddenColumns["funding_source_name"],
      emptyValue: "-",
      cellStyle: { whiteSpace: "noWrap" },
      render: (entry) => {
        return entry.funding_source_name
          .split(",")
          .map((funding_source_name, i) => (
            <span key={i} style={{ display: "block" }}>
              {funding_source_name}
            </span>
          ));
      },
    },
    {
      title: "Status update",
      field: "project_note",
      hidden: hiddenColumns["project_note"],
      emptyValue: "-",
      cellStyle: { maxWidth: "30rem" },
      render: (entry) => parse(String(entry.project_note)),
    },
    {
      title: "Construction start",
      field: "construction_start_date",
      hidden: hiddenColumns["construction_start_date"],
      emptyValue: "-",
      render: (entry) => formatDateType(entry.construction_start_date),
    },
    {
      title: "Completion date",
      field: "completion_end_date",
      hidden: hiddenColumns["completion_end_date"],
      emptyValue: "-",
      render: (entry) => formatDateType(entry.completion_end_date),
    },
    {
      title: "Designer",
      field: "project_designer",
      hidden: hiddenColumns["project_designer"],
      emptyValue: "-",
    },
    {
      title: "Inspector",
      field: "project_inspector",
      hidden: hiddenColumns["project_inspector"],
      emptyValue: "-",
    },
    {
      title: "Contractors",
      field: "contractors",
      hidden: hiddenColumns["contractors"],
      emptyValue: "-",
      cellStyle: { whiteSpace: "noWrap" },
      render: (entry) => {
        return entry.contractors.split(",").map((contractor, i) => (
          <span key={i} style={{ display: "block" }}>
            {contractor}
          </span>
        ));
      },
    },
    {
      title: "Contract numbers",
      field: "contract_numbers",
      hidden: hiddenColumns["contract_numbers"],
      emptyValue: "-",
      cellStyle: { whiteSpace: "noWrap" },
      render: (entry) => {
        return entry.contract_numbers.split(",").map((contractNumber, i) => (
          <span key={i} style={{ display: "block" }}>
            {contractNumber}
          </span>
        ));
      },
    },
    {
      title: "Tags",
      field: "project_tags",
      hidden: hiddenColumns["project_tags"],
      cellStyle: { whiteSpace: "noWrap" },
      emptyValue: "-",
      render: (entry) => {
        return entry.project_tags.split(",").map((tag) => (
          <span key={tag} style={{ display: "block" }}>
            {tag}
          </span>
        ));
      },
    },
    {
      title: "Created by",
      field: "added_by",
      hidden: hiddenColumns["added_by"],
      emptyValue: "-",
    },
    {
      title: "Public process status",
      field: "public_process_status",
      hidden: hiddenColumns["public_process_status"],
      emptyValue: "-",
    },
    {
      title: "Interim MPD (Access) ID",
      field: "interim_project_id",
      hidden: hiddenColumns["interim_project_id"],
      emptyValue: "-",
    },
    {
      title: "Parent project",
      field: "parent_project_id",
      hidden: hiddenColumns["parent_project_id"],
      emptyValue: "-",
      render: (entry) => (
        <RouterLink
          to={`/moped/projects/${entry.parent_project_id}`}
          state={{ filters: linkStateFilters }}
          className={classes.colorPrimary}
        >
          {entry.parent_project_name}
        </RouterLink>
      ),
    },
    {
      title: "Has subprojects",
      field: "children_project_ids",
      hidden: hiddenColumns["children_project_ids"],
      render: (entry) => {
        const hasChildren = entry.children_project_ids.length > 0;
        return <span> {hasChildren ? "Yes" : "-"} </span>;
      },
      emptyValue: "-",
    },
  ];

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

  const { data, loading, error } = useQuery(projectListViewQuery, {
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
  const handleTableHeaderClick = (columnId, newOrderDirection) => {
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
  };

  /*
   * Store column configution before data change triggers page refresh
   * or opening advanced search dropdown triggers page refresh
   */
  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem("mopedColumnConfig"));
    if (storedConfig) {
      setHiddenColumns(storedConfig);
    }
  }, [data, advancedSearchAnchor]);

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
            {loading ? (
              <CircularProgress />
            ) : data && data["project_list_view"] ? (
              <Card className={classes.root}>
                <MaterialTable
                  onChangeColumnHidden={handleColumnChange}
                  data={data["project_list_view"]}
                  columns={columns}
                  title=""
                  options={{
                    search: false,
                    rowStyle: {
                      fontFamily: typography.fontFamily,
                      fontSize: "14px",
                    },
                    pageSize: Math.min(
                      queryLimit,
                      data["project_list_view"]?.length
                    ),
                    headerStyle: {
                      // material table header row has a zIndex of 10, which
                      // is conflicting with the search/filter dropdown
                      zIndex: 1,
                      whiteSpace: "nowrap",
                    },
                    columnsButton: true,
                    idSynonym: "project_id",
                  }}
                  components={{
                    Pagination: (props) => (
                      <Pagination
                        recordCount={
                          data["project_list_view_aggregate"]?.aggregate.count
                        }
                        queryLimit={queryLimit}
                        setQueryLimit={setQueryLimit}
                        queryOffset={queryOffset}
                        setQueryOffset={setQueryOffset}
                        rowsPerPageOptions={
                          PROJECT_LIST_VIEW_QUERY_CONFIG.pagination
                            .rowsPerPageOptions
                        }
                      />
                    ),
                    Header: (props) => (
                      <MTableHeader
                        {...props}
                        onOrderChange={handleTableHeaderClick}
                        orderBy={sortByColumnIndex}
                        orderDirection={orderByDirection}
                      />
                    ),
                  }}
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
