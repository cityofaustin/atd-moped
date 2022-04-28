import React, { useState, useEffect } from "react";
import { NavLink as RouterLink, useLocation } from "react-router-dom";

import {
  Box,
  Card,
  CircularProgress,
  Container,
  Paper,
  Typography,
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

import MaterialTable, { MTableBody } from "@material-table/core";
import { filterProjectTeamMembers as renderProjectTeamMembers } from "./helpers.js";

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
  title: {
    position: "relative",
    top: "1.2rem",
    left: "0.3rem",
    "text-shadow": "1px 1px 0px white",
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
 * Note: also used in NavigationSearchInput
 * Attempts to retrieve a valid graphql search value, for example when searching on an
 * integer/float field but providing it a string, this function returns the value configured
 * in the invalidValueDefault field in the search object, or null.
 * @param {Object} query - The GraphQL query configuration
 * @param {string} column - The name of the column to search
 * @param {*} value - The value in question
 * @returns {*} - The value output
 */
export const getSearchValue = (query, column, value) => {
  // Retrieve the type of field (string, float, int, etc)
  const type = query.config.columns[column].type.toLowerCase();
  // Get the invalidValueDefault in the search config object
  const invalidValueDefault =
    query.config.columns[column].search?.invalidValueDefault ?? null;
  // If the type is number of float, attempt to parse as such
  if (["number", "float", "double"].includes(type)) {
    value = Number.parseFloat(value) || invalidValueDefault;
  }
  // If integer, attempt to parse as integer
  if (["int", "integer"].includes(type)) {
    value = Number.parseInt(value) || invalidValueDefault;
  }
  // Any other value types are pass-through for now
  return value;
};

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
        buildStatusBadge(entry.current_phase, entry.current_status),
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
      render: entry => new Date(entry.updated_at).toLocaleDateString("en-US"),
    },
    {
      title: "Signal IDs",
      field: "project_feature",
      hidden: hiddenColumns["project_feature"],
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
  ];

  useEffect(() => {
    const storedConfig = JSON.parse(localStorage.getItem("mopedColumnConfig"));
    setHiddenColumns(storedConfig);
  }, [data]);


  return (
    <ApolloErrorHandler error={error}>
      <Container maxWidth={false} className={classes.root}>
        {/*Title*/}
        <Typography
          variant="h1"
          component="h1"
          align="left"
          className={classes.title}
        >
          {title}
        </Typography>
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
