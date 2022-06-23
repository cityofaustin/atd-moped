import React, { useState, useEffect } from "react";
import { NavLink as RouterLink, useLocation } from "react-router-dom";

import {
  Box,
  Card,
  CircularProgress,
  Container,
  Paper,
} from "@material-ui/core";

// Styling
import makeStyles from "@material-ui/core/styles/makeStyles";
import typography from "../../../theme/typography";

import { useQuery } from "@apollo/client";
import GridTableToolbar from "../../../components/GridTable/GridTableToolbar";
import GridTableSearch from "../../../components/GridTable/GridTableSearch";
import GridTablePagination from "../../../components/GridTable/GridTablePagination";
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectStatusBadge from "./../projectView/ProjectStatusBadge";
import ExternalLink from "../../../components/ExternalLink";
import RenderSignalLink from "../signalProjectTable/RenderSignalLink";
import ProjectsListViewTableToolbar from "./ProjectsListViewTableToolbar";

import MaterialTable, { MTableBody, MTableHeader } from "@material-table/core";
import { filterProjectTeamMembers as renderProjectTeamMembers } from "./helpers.js";
import { getSearchValue } from "../../../utils/gridTableHelpers";
import { formatDateType, formatTimeStampTZType } from "src/utils/dateAndTime";

/**
 * GridTable Style
 */
const useStyles = makeStyles(theme => ({
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
 * @param {string} title - The title header of the component
 * @param {Object} query - The GraphQL query configuration
 * @param {String} searchTerm - The initial term
 * @param {Object} referenceData - optional, static data used in presentation
 * @return {JSX.Element}
 * @constructor
 */
const ProjectsListViewTable = ({ title, query, searchTerm, referenceData }) => {
  const classes = useStyles();

  /**
   * @type {Object} pagination
   * @property {integer} limit - The limit of records to be shown in a single page (default: query.limit)
   * @property {integer} offset - The number of records to be skipped in GraphQL (default: query.limit)
   * @property {integer} page - Current page being shown (0 to N) where 0 is the first page (default: 0)
   * @function setPagination - Sets the state of pagination
   * @default {{limit: query.limit, offset: query.offset, page: 0}}
   */
  const [pagination, setPagination] = useState({
    limit: query.limit,
    offset: query.offset,
    page: 0,
  });

  /**
   * Stores the column name and the order to order by
   * @type {Object} sort
   * @property {string} column - The column name in graphql to sort by
   * @property {string} order - Either "asc" or "desc" or "" (default: "")
   * @function setSort - Sets the state of sort
   * @default {{value: "", column: ""}}
   */
  const [sort, setSort] = useState({
    column: "",
    order: "",
  });

  /**
   * Stores the string to search for and the column to search against
   * @type {Object} search
   * @property {string} value - The string to be searched for
   * @property {string} column - The name of the column to search against
   * @function setSearch - Sets the state of search
   * @default {{value: "", column: ""}}
   */
  const [search, setSearch] = useState({
    value: searchTerm ?? "",
    column: "",
  });

  // anchor element for advanced search popper in GridTableSearch to "attach" to
  // State is handled here so we can listen for changes in a useeffect in this component
  const [advancedSearchAnchor, setAdvancedSearchAnchor] = useState(null);

  // create URLSearchParams from url
  const filterQuery = new URLSearchParams(useLocation().search);

  /**
   * if filter exists in url, decodes base64 string and returns as object
   * Used to initialize filter state
   * @return Object if valid JSON otherwise false
   */
  const getFilterQuery = () => {
    if (Array.from(filterQuery).length > 0) {
      try {
        return JSON.parse(atob(filterQuery.get("filter")));
      } catch {
        return false;
      }
    }
    return false;
  };

  /**
   * Stores objects storing a random id, column, operator, and value.
   * @type {Object} filters
   * @function setFilter - Sets the state of filters
   * @default {if filter in url, use those params, otherwise {}}
   */
  const [filters, setFilter] = useState(getFilterQuery() || {});

  const defaultHiddenColumns = {
    project_name: false,
    current_phase: false,
    project_team_members: false,
    project_sponsor: false,
    project_partner: false,
    ecapris_subproject_id: false,
    updated_at: false,
    project_feature: false, // signal_ids
    task_order: true,
    contractor: true,
    purchase_order_number: true,
    type_name: true,
    funding_source_name: true,
    project_note: true,
    construction_start_date: false,
    completion_end_date: false,
    project_inspector: true,
    project_designer: true,
  };

  const [hiddenColumns, setHiddenColumns] = useState(
    JSON.parse(localStorage.getItem("mopedColumnConfig")) ??
      defaultHiddenColumns
  );

  const toggleColumnConfig = (field, hiddenState) => {
    let storedConfig = JSON.parse(localStorage.getItem("mopedColumnConfig"));
    storedConfig = { ...storedConfig, [field]: hiddenState };
    localStorage.setItem("mopedColumnConfig", JSON.stringify(storedConfig));
  };

  /**
   * Query Management
   */
  // Manage the ORDER BY clause of our query
  if (sort.column !== "" && sort.order !== "") {
    query.setOrder(sort.column, sort.order);
  }

  // Set limit, offset based on pagination state
  if (query.config.showPagination) {
    query.limit = pagination.limit;
    query.offset = pagination.offset;
  } else {
    query.limit = 0;
  }

  // Resets the value of "where" "and" "or" to empty
  query.cleanWhere();

  // If we have a search value in state, initiate search
  // GridTableSearchBar in GridTableSearch updates search value
  if (search.value && search.value !== "") {
    /**
     * Iterate through all column keys, if they are searchable
     * add the to the Or list.
     */
    Object.keys(query.config.columns)
      .filter(column => query.config.columns[column]?.searchable)
      .forEach(column => {
        const { operator, quoted, envelope } = query.config.columns[
          column
        ].search;
        const searchValue = getSearchValue(query, column, search.value);
        const graphqlSearchValue = quoted
          ? `"${envelope.replace("{VALUE}", searchValue)}"`
          : searchValue;

        query.setOr(column, `${operator}: ${graphqlSearchValue}`);
      });
  }

  // For each filter added to state, add a where clause in GraphQL
  // Advanced Search
  Object.keys(filters).forEach(filter => {
    let {
      envelope,
      field,
      gqlOperator,
      value,
      type,
      specialNullValue,
    } = filters[filter];

    // If we have no operator, then there is nothing we can do.
    if (field === null || gqlOperator === null) {
      return;
    }

    // If the operator includes "is_null", we check for empty strings
    if (gqlOperator.includes("is_null")) {
      gqlOperator = envelope === "true" ? "_eq" : "_neq";
      value = specialNullValue ? specialNullValue : '""';
    } else {
      if (value !== null) {
        // If there is an envelope, insert value in envelope.
        value = envelope ? envelope.replace("{VALUE}", value) : value;

        // If it is a number or boolean, it does not need quotation marks
        // Otherwise, add quotation marks for the query to identify as string
        value = type in ["number", "boolean"] ? value : `"${value}"`;
      } else {
        // We don't have a value
        return;
      }
    }
    query.setWhere(field, `${gqlOperator}: ${value}`);
  });

  /**
   * Returns a ProjectStatusBadge component based on the status and phase of project
   * @param {string} phase - A project's current phase
   * @param {number} statusId - Project's status id
   * @return {JSX.Element}
   */
  const buildStatusBadge = (phase, statusId) => (
    <ProjectStatusBadge
      status={statusId}
      phase={phase}
      projectStatuses={referenceData?.moped_status ?? []}
      condensed
    />
  );

  // Data Management
  const { data, loading, error } = useQuery(
    query.gql,
    query.config.options.useQuery
  );

  const columns = [
    {
      title: "Project name",
      field: "project_name",
      hidden: hiddenColumns["project_name"],
      render: entry => (
        <RouterLink
          to={`/moped/projects/${entry.project_id}`}
          state={{
            filters: Object.keys(filters).length
              ? btoa(JSON.stringify(filters))
              : false,
          }}
          className={"MuiTypography-colorPrimary"}
        >
          {entry.project_name}
        </RouterLink>
      ),
    },
    {
      title: "Status",
      field: "current_phase",
      hidden: hiddenColumns["current_phase"],
      render: entry =>
        buildStatusBadge(entry.current_phase, entry.status_id),
    },
    {
      title: "Team members",
      field: "project_team_members",
      hidden: hiddenColumns["project_team_members"],
      cellStyle: { whiteSpace: "pre-wrap" },
      render: entry => renderProjectTeamMembers(entry.project_team_members),
    },
    {
      title: "Project sponsor",
      field: "project_sponsor",
      hidden: hiddenColumns["project_sponsor"],
      editable: "never",
      render: entry =>
        entry.project_sponsor === "None" ? "-" : entry.project_sponsor,
    },
    {
      title: "Project partners",
      field: "project_partner",
      hidden: hiddenColumns["project_partner"],
      emptyValue: "-",
    },
    {
      title: "eCAPRIS ID",
      field: "ecapris_subproject_id",
      hidden: hiddenColumns["ecapris_subproject_id"],
      render: entry => (
        <ExternalLink
          text={entry.ecapris_subproject_id}
          url={`https://ecapris.austintexas.gov/index.cfm?fuseaction=subprojects.subprojectData&SUBPROJECT_ID=${entry.ecapris_subproject_id}`}
        />
      ),
    },
    {
      title: "Last modified",
      field: "updated_at",
      hidden: hiddenColumns["updated_at"],
      render: entry => formatTimeStampTZType(entry.updated_at),
    },
    {
      title: "Signal IDs",
      field: "project_feature",
      hidden: hiddenColumns["project_feature"],
      sorting: false,
      render: entry => {
        // if there are no features, project_feature is [null]
        if (!entry?.project_feature[0]) {
          return "-";
        } else {
          const signalIds = [];
          entry.project_feature.forEach(projectFeature => {
            const signal = projectFeature?.properties?.signal_id;
            if (signal) {
              signalIds.push({
                signal_id: signal,
                knack_id: projectFeature.properties.id,
              });
            }
          });
          return <RenderSignalLink signals={signalIds} />;
        }
      },
    },
    {
      title: "Task order",
      field: "task_order",
      hidden: hiddenColumns["task_order"],
      emptyValue: "-",
      render: entry => {
        // Empty value won't work in some cases where task_order is an empty array.
        if (entry?.task_order.length < 1) {
          return "-";
        }
        // Render values as a comma seperated string
        let content = entry.task_order
          .map(taskOrder => {
            return taskOrder.display_name;
          })
          .join(", ");

        return <div style={{ maxWidth: "265px" }}>{content}</div>;
      },
    },
    {
      title: "Contractor/Contract",
      field: "contractor",
      hidden: hiddenColumns["contractor"],
      emptyValue: "-",
      render: entry => (entry.contractor === "" ? "-" : entry.contractor),
    },
    {
      title: "Project DO#",
      field: "purchase_order_number",
      hidden: hiddenColumns["purchase_order_number"],
      emptyValue: "-",
      render: entry =>
        entry.purchase_order_number.trim().length === 0
          ? "-"
          : entry.purchase_order_number,
    },
    {
      title: "Project type",
      field: "type_name",
      hidden: hiddenColumns["type_name"],
      emptyValue: "-",
    },
    {
      title: "Funding source",
      field: "funding_source_name",
      hidden: hiddenColumns["funding_source_name"],
      emptyValue: "-",
    },
    {
      title: "Status update",
      field: "project_note",
      hidden: hiddenColumns["project_note"],
      emptyValue: "-",
    },
    {
      title: "Construction start",
      field: "construction_start_date",
      hidden: hiddenColumns["construction_start_date"],
      emptyValue: "-",
      render: entry => formatDateType(entry.construction_start_date),
    },
    {
      title: "Project completion",
      field: "completion_end_date",
      hidden: hiddenColumns["completion_end_date"],
      emptyValue: "-",
      render: entry => formatDateType(entry.completion_end_date),
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
  ];

  /**
   * Handles the header click for sorting asc/desc.
   * @param {int} columnId
   * @param {string} newOrderDirection
   * Note: this is a GridTable function that we are using to override a Material Table sorting function
   * Their function call uses two variables, columnId and newOrderDirection. We only need the columnId
   **/
  const handleTableHeaderClick = (columnId, newOrderDirection) => {
    // Before anything, let's clear all current conditions
    query.clearOrderBy();
    const columnName = columns[columnId]?.field;

    // If both column and order are empty...
    if (sort.order === "" && sort.column === "") {
      // First time sort is applied
      setSort({
        order: "asc",
        column: columnName,
      });
    } else if (sort.column === columnName) {
      // Else if the current sortColumn is the same as the new
      // then invert values and repeat sort on column
      setSort({
        order: sort.order === "desc" ? "asc" : "desc",
        column: columnName,
      });
    } else if (sort.column !== columnName) {
      // Sort different column after initial sort, then reset
      setSort({
        order: "desc",
        column: columnName,
      });
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
        {/*Toolbar Space*/}
        <GridTableToolbar>
          <GridTableSearch
            parentData={data}
            query={query}
            searchState={{
              searchParameters: search,
              setSearchParameters: setSearch,
            }}
            filterState={{
              filterParameters: filters,
              setFilterParameters: setFilter,
            }}
            filterQuery={filterQuery}
            advancedSearchAnchor={advancedSearchAnchor}
            setAdvancedSearchAnchor={setAdvancedSearchAnchor}
          />
        </GridTableToolbar>
        {/*Main Table Body*/}
        <Paper className={classes.paper}>
          <Box mt={3}>
            {loading ? (
              <CircularProgress />
            ) : data && data["project_list_view"] ? (
              <Card className={classes.root}>
                <MaterialTable
                  data={data["project_list_view"]}
                  columns={columns}
                  title=""
                  options={{
                    search: false,
                    rowStyle: {
                      fontFamily: typography.fontFamily,
                      fontSize: "14px",
                    },
                    pageSize: Math.min(query.limit, data[query.table].length),
                    headerStyle: {
                      // material table header row has a zIndex of 10, which
                      // is conflicting with the search/filter dropdown
                      zIndex: 1,
                    },
                    columnsButton: true,
                  }}
                  components={{
                    Pagination: props => (
                      <GridTablePagination
                        query={query}
                        data={data}
                        pagination={pagination}
                        setPagination={setPagination}
                      />
                    ),
                    Toolbar: props => {
                      return (
                        <ProjectsListViewTableToolbar
                          toggleColumnConfig={toggleColumnConfig}
                          {...props}
                        />
                      );
                    },
                    Header: props => (
                      <MTableHeader
                        {...props}
                        onOrderChange={handleTableHeaderClick}
                        orderDirection={sort.order}
                      />
                    ),
                    Body: props => {
                      const indexedData = data["project_list_view"].map(
                        (row, index) => ({
                          tableData: { id: index },
                          ...row,
                        })
                      );
                      return (
                        <MTableBody
                          {...props}
                          renderData={indexedData}
                          pageSize={indexedData.length}
                        />
                      );
                    },
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
