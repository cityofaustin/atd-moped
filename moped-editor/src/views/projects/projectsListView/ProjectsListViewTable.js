import React, { useState } from "react";
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
import ApolloErrorHandler from "../../../components/ApolloErrorHandler";
import ProjectStatusBadge from "./../projectView/ProjectStatusBadge";
import ExternalLink from "../../../components/ExternalLink";

import MaterialTable from "@material-table/core";
import { filterProjectTeamMembers as renderProjectTeamMembers } from "./helpers.js";
import { PAGING_DEFAULT_COUNT } from "../../../constants/tables";

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

  // // Set limit, offset and clear any 'Where' filters
  // if (query.config.showPagination) {
  //   query.limit = pagination.limit;
  //   query.offset = pagination.offset;
  // } else {
  //   query.limit = 0;
  // }

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

  // /**
  //  * Returns true if the input string is a valid alphanumeric object key
  //  * @param {string} input - The string to be tested
  //  * @returns {boolean}
  //  */
  // const isAlphanumeric = input => input.match(/^[0-9a-zA-Z\-_]+$/) !== null;

  // /**
  //  * Extracts a list of keys in a graphql expression
  //  * @param {string} exp - The expression
  //  * @returns {Array}
  //  */
  // const listKeys = exp =>
  //   exp.split(/[{} ]+/).filter(n => isAlphanumeric(n) && n !== "");

  // *
  //  * Returns the value of a data structure based on the list of keys provided
  //  * @param {object} obj - the item from the row section
  //  * @param {Array} keys - the list of keys
  //  * @returns {*}

  // const responseValue = (obj, keys) => {
  //   for (let k = 1; k < keys.length; k++) {
  //     try {
  //       obj = obj[keys[k]];
  //     } catch {
  //       obj = null;
  //     }
  //   }
  //   return obj;
  // };

  // /**
  //  * Extracts the value (or summary of values) for nested field names
  //  * @param {object} obj - The dataset current object (the table row)
  //  * @param {string} exp - The graphql expression (from the column name)
  //  * @returns {string}
  //  */
  // const getSummary = (obj, exp) => {
  //   let result = [];
  //   let map = new Map();
  //   const keys = listKeys(exp);

  //   // First we need to get to the specific section of the dataset object
  //   // The first key is the outermost nested part of the graphql query
  //   const section = obj[keys[0]];

  //   // Bypass value extraction if column value should be "stringified"
  //   if (query.config.columns[exp]?.stringify) {
  //     return JSON.stringify(section);
  //   }

  //   // If not an array, resolve its value
  //   if (!Array.isArray(section)) {
  //     // Return direct value
  //     return responseValue(section, keys);
  //   }

  //   // If it is an array, resolve each and aggregate
  //   for (let item of section) {
  //     let val = responseValue(item, keys);

  //     if (val !== null) {
  //       map.set(val, true);
  //       result.push(val);
  //     }
  //   }
  //   // Merge all into a string
  //   return result.join(", ");
  // };

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

  /**
   * Data Management
   */
  const { data, loading, error } = useQuery(
    query.gql,
    query.config.options.useQuery
  );

  console.log(data);

  const columns = [
    {
      title: "Project name",
      field: "project_name",
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
      render: entry =>
        buildStatusBadge(entry.current_phase, entry.current_status),
    },
    {
      title: "Team members",
      field: "project_team_members",
      render: entry => renderProjectTeamMembers(entry.project_team_members),
    },
    {
      title: "Project sponsor",
      field: "project_sponsor",
      editable: "never",
      render: entry =>
        entry.project_sponsor === "None" ? "-" : entry.project_sponsor,
    },
    {
      title: "Project partners",
      field: "project_partners",
    },
    {
      title: "eCAPRIS ID",
      field: "ecapris_subproject_id",
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
      render: entry => new Date(entry.updated_at).toLocaleDateString("en-US"),
    },
  ];

  console.log(query.query)

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
            ) : data ? (
              <Card className={classes.root}>
                <MaterialTable
                  columns={columns}
                  data={data[query.table]}
                  options={{
                    search: false,
                    rowStyle: {
                      fontFamily: typography.fontFamily,
                    },
                    ...(data[query.table].length < PAGING_DEFAULT_COUNT + 1 && {
                      paging: false,
                    }),
                    pageSize: 30,
                    pageSizeOptions: [10, 30, 100],
                    headerStyle: {
                      whiteSpace: "nowrap",
                      position: "sticky",
                      top: 0,
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
