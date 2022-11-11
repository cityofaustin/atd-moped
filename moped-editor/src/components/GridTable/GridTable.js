import React, { useState } from "react";
import { NavLink as RouterLink, useLocation } from "react-router-dom";

/**
 * Material UI
 */
import {
  Box,
  Card,
  CircularProgress,
  Container,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";

// Styling
import makeStyles from "@material-ui/core/styles/makeStyles";

// Abstract & GridTable
import { useQuery } from "@apollo/client";
import GridTableToolbar from "./GridTableToolbar";
import GridTableListHeader from "./GridTableListHeader";
import GridTablePagination from "./GridTablePagination";
import GridTableSearch from "./GridTableSearch";
import ApolloErrorHandler from "../ApolloErrorHandler";
import { getSearchValue } from "../../utils/gridTableHelpers";

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
 * GridTable Component for Material UI
 * @param {string} title - The title header of the component
 * @param {Object} query - The GraphQL query configuration
 * @param {String} searchTerm - The initial term
 * @param {Object} referenceData - optional, static data used in presentation
 * @param {Object} customComponents - An object containing custom components
 * @return {JSX.Element}
 * @constructor
 */
const GridTable = ({
  title,
  query,
  searchTerm,
  referenceData,
  customComponents,
}) => {
  const classes = useStyles();

  /**
   * State Management for pagination
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
  // State is handled here so we could listen for changes in a useeffect in this component
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

  /**
   * Query Management
   */
  // Manage the ORDER BY clause of our query
  if (sort.column !== "" && sort.order !== "") {
    query.setOrder(sort.column, sort.order);
  }

  // Set limit, offset and clear any 'Where' filters
  if (query.config.showPagination) {
    query.limit = pagination.limit;
    query.offset = pagination.offset;
  } else {
    query.limit = 0;
  }

  query.cleanWhere();

  // If we have a search value in state, initiate search
  // GridTableSearchBar in GridTableSearch updates search value
  if (search.value && search.value !== "") {
    /**
     * Iterate through all column keys, if they are searchable
     * add the to the Or list.
     */
    Object.keys(query.config.columns)
      .filter((column) => query.config.columns[column]?.searchable)
      .forEach((column) => {
        const { operator, quoted, envelope } =
          query.config.columns[column].search;
        const searchValue = getSearchValue(query, column, search.value);
        const graphqlSearchValue = quoted
          ? `"${envelope.replace("{VALUE}", searchValue)}"`
          : searchValue;

        query.setOr(column, `${operator}: ${graphqlSearchValue}`);
      });
  }

  // For each filter added to state, add a where clause in GraphQL
  // Advanced Search
  Object.keys(filters).forEach((filter) => {
    let { envelope, field, gqlOperator, value, type, specialNullValue } =
      filters[filter];

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
   * Handles the header click for sorting asc/desc.
   * @param {string} columnName - The name of the column
   **/
  const handleTableHeaderClick = (columnName) => {
    // Before anything, let's clear all current conditions
    query.clearOrderBy();

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

  /**
   * Returns true if the input string is a valid alphanumeric object key
   * @param {string} input - The string to be tested
   * @returns {boolean}
   */
  const isAlphanumeric = (input) => input.match(/^[0-9a-zA-Z\-_]+$/) !== null;

  /**
   * Extracts a list of keys in a graphql expression
   * @param {string} exp - The expression
   * @returns {Array}
   */
  const listKeys = (exp) =>
    exp.split(/[{} ]+/).filter((n) => isAlphanumeric(n) && n !== "");

  /**
   * Returns the value of a data structure based on the list of keys provided
   * @param {object} obj - the item from the row section
   * @param {Array} keys - the list of keys
   * @returns {*}
   */
  const responseValue = (obj, keys) => {
    for (let k = 1; k < keys.length; k++) {
      try {
        obj = obj[keys[k]];
      } catch {
        obj = null;
      }
    }
    return obj;
  };

  /**
   * Extracts the value (or summary of values) for nested field names
   * @param {object} obj - The dataset current object (the table row)
   * @param {string} exp - The graphql expression (from the column name)
   * @returns {string}
   */
  const getSummary = (obj, exp) => {
    let result = [];
    let map = new Map();
    const keys = listKeys(exp);

    // First we need to get to the specific section of the dataset object
    // The first key is the outermost nested part of the graphql query
    const section = obj[keys[0]];

    // Bypass value extraction if column value should be "stringified"
    if (query.config.columns[exp]?.stringify) {
      return JSON.stringify(section);
    }

    // If not an array, resolve its value
    if (!Array.isArray(section)) {
      // Return direct value
      return responseValue(section, keys);
    }

    // If it is an array, resolve each and aggregate
    for (let item of section) {
      let val = responseValue(item, keys);

      if (val !== null) {
        map.set(val, true);
        result.push(val);
      }
    }
    // Merge all into a string
    return result.join(", ");
  };

  /**
   * Returns a stringified object with information to format link.
   * @param {string} row - row from data
   * @param {Object} column - column with link attribute
   * @return {string}
   */
  const buildLinkData = (row, column) =>
    JSON.stringify({
      singleItem: query.singleItem,
      data: row[column],
      link: row[query.config.columns[column].link],
      state: {
        filters: Object.keys(filters).length
          ? btoa(JSON.stringify(filters))
          : false,
      },
    });

  /**
   * Data Management
   */
  const { data, loading, error } = useQuery(
    query.gql,
    query.config.options.useQuery
  );

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
          {customComponents?.toolbar?.before}
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
          {customComponents?.toolbar?.after}
        </GridTableToolbar>
        {/*Main Table Body*/}
        {customComponents?.table?.before}
        <Paper className={classes.paper}>
          <Box mt={3}>
            {loading ? (
              <CircularProgress />
            ) : data ? (
              <Card className={classes.root}>
                <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                    <GridTableListHeader
                      query={query}
                      sortOrder={sort.order}
                      sortColumn={sort.column}
                      handleTableHeaderClick={handleTableHeaderClick}
                    />
                    <TableBody>
                      {data[query.table].length < 1 ? (
                        <TableRow>
                          <TableCell colSpan={8} className={classes.noResults}>
                            <Typography align="center">
                              {query.config.noResultsMessage ??
                                "No results found"}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        data[query.table].map((row, rowIndex) => {
                          return (
                            <TableRow hover key={rowIndex}>
                              {query.columns.map(
                                (column, columnIndex) =>
                                  // If column is hidden, don't render <td>
                                  !query.isHidden(column) && (
                                    <TableCell
                                      size="small"
                                      key={columnIndex}
                                      width={
                                        query.config.columns[
                                          column
                                        ].hasOwnProperty("width")
                                          ? query.config.columns[column].width
                                          : 0
                                      }
                                      className={
                                        query.config.columns[
                                          column
                                        ].hasOwnProperty("className")
                                          ? query.config.columns[column]
                                              .className
                                          : classes.tableCell
                                      }
                                    >
                                      {query.isPK(column) ? (
                                        // If there is custom JSX for the PK single item button, render it
                                        (query.config.customSingleItemButton &&
                                          query.config.customSingleItemButton(
                                            row[column]
                                          )) || (
                                          <RouterLink
                                            to={`/${query.singleItem}/${row[column]}`}
                                          >
                                            {query.config.columns[
                                              column
                                            ].hasOwnProperty("icon") ? (
                                              <Icon
                                                color={
                                                  query.config.columns[column]
                                                    .icon.color
                                                }
                                              >
                                                {
                                                  query.config.columns[column]
                                                    .icon.name
                                                }
                                              </Icon>
                                            ) : (
                                              row[column]
                                            )}
                                          </RouterLink>
                                        )
                                      ) : query.config.columns[column]?.link ? (
                                        query.getFormattedValue(
                                          column,
                                          buildLinkData(row, column)
                                        )
                                      ) : isAlphanumeric(column) ? (
                                        <>
                                          {query.getFormattedValue(
                                            column,
                                            row[column]
                                          )}
                                        </>
                                      ) : (
                                        // if column is not alphanumeric
                                        // it is formatted like a nested query
                                        query.getFormattedValue(
                                          column,
                                          getSummary(row, column.trim())
                                        )
                                      )}
                                    </TableCell>
                                  )
                              )}
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/*Pagination Management*/}
                {query.config.showPagination && (
                  <GridTablePagination
                    query={query}
                    data={data}
                    pagination={pagination}
                    setPagination={setPagination}
                  />
                )}
              </Card>
            ) : (
              <span>{error ? error : "Could not fetch data"}</span>
            )}
          </Box>
        </Paper>
        {customComponents?.table?.after}
      </Container>
    </ApolloErrorHandler>
  );
};

export default GridTable;
