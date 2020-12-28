import React, { useState } from "react";
import { NavLink as RouterLink } from "react-router-dom";

/**
 * Material UI
 */
import {
  Box,
  Card,
  Chip,
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
import { useQuery } from "@apollo/react-hooks";
import GridTableToolbar from "./GridTableToolbar";
import GridTableListHeader from "./GridTableListHeader";
import GridTablePagination from "./GridTablePagination";
import GridTableSearch from "./GridTableSearch";
import GridTableExport from "./GridTableExport";

/**
 * GridTable Style
 */
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  title: {
    position: "relative",
    top: "1rem",
    "text-shadow": "1px 1px 0px white",
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  container: {
    maxHeight: "55vh",
  },
  tableCell: {
    "text-transform": "capitalize",
  },
}));

/**
 * GridTable Component for Material UI
 * @param {string} title - The title header of the component
 * @param {Object} query - The GraphQL query configuration
 * @param {Object} filters - Filter configuration
 * @param {string[]} columnsToExport - An array of strings containing the names of columns to export
 * @param {Object} aggregateQueryConfig - Aggregate query configuration
 * @param {JSX.Element} header - Any elements to be rendered for the header
 * @return {JSX.Element}
 * @constructor
 */
const GridTable = ({
  title,
  query,
  filters,
  columnsToExport,
  aggregateQueryConfig,
  toolbar,
}) => {
  // Style
  const classes = useStyles();

  /**
   * State Management
   */
  const [pagination, setPagination] = useState({
    limit: query.limit,
    offset: query.offset,
    page: 0,
  });

  const [sort, setSort] = useState({
    column: "",
    order: "",
  });

  /**
   * Query Management
   */
  // Manage the ORDER BY clause of our query
  if (sort.column !== "" && sort.order !== "") {
    query.setOrder(sort.column, sort.order);
  }

  query.limit = pagination.limit;
  query.offset = pagination.offset;

  /**
   * Handles the header click for sorting asc/desc.
   * @param {string} columnName - The name of the column
   **/
  const handleTableHeaderClick = columnName => {
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
   * Removes any non-alphanumeric characters from a string
   * @param {str} input - The text to be cleaned
   * @returns {str}
   */
  const cleanUpText = input => {
    return String(input).replace(/[^0-9a-z]/gi, "");
  };

  /**
   * Returns true if the input string is a valid alphanumeric object key
   * @param {string} input - The string to be tested
   * @returns {boolean}
   */
  const isAlphanumeric = input => input.match(/^[0-9a-zA-Z\-_]+$/) !== null;

  /**
   * Extracts a list of keys in a graphql expression
   * @param {string} exp - The expression
   * @returns {Array}
   */
  const listKeys = exp =>
    exp.split(/[{} ]+/).filter(n => isAlphanumeric(n) && n !== "");

  /**
   * Returns the value of a data structure based on the list of keys provided
   * @param {object} obj - the object in question
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
   * @param {object} obj - The dataset current object
   * @param {string} exp - The graphql expression
   * @returns {string}
   */
  const getSummary = (obj, exp) => {
    let result = [];
    let map = new Map();
    const keys = listKeys(exp);

    // First we need to get to the specific section of the object we need
    const section = obj[keys[0]];

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
   * Returns a Chip object containing the status of the project.
   * @param {string} label - The the text that goes inside the Chip component
   * @param {Object} labelColorMap - The mapping of label to Material color name
   * @param {string} defaultLabel - The the text that goes inside the Chip component
   * @return {JSX.Element}
   */
  const buildChip = (label, labelColorMap, defaultLabel = "No Status") => {
    const cleanLabel = cleanUpText(label);
    return String(label) !== "" ? (
      <Chip
        color={labelColorMap[cleanLabel.toLowerCase()] || "default"}
        size={"small"}
        label={cleanLabel}
      />
    ) : (
      <span>{defaultLabel}</span>
    );
  };

  /**
   * Data Management
   */
  console.log(query.query);
  const { data, loading, error } = useQuery(
    query.gql,
    query.config.options.useQuery
  );

  return (
    <Container maxWidth={false} className={classes.root}>
      {/*Title*/}
      <Typography
        variant="h1"
        component="h2"
        align="left"
        className={classes.title}
      >
        {title}
      </Typography>
      {/*Toolbar Space*/}
      <GridTableToolbar>
        <GridTableSearch query={query}>
          <GridTableExport query={query} />
        </GridTableSearch>
      </GridTableToolbar>
      {/*Main Table Body*/}
      <Paper className={classes.paper}>
        <Box mt={3}>
          {loading ? (
            <CircularProgress />
          ) : data ? (
            <Card className={classes.root}>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <GridTableListHeader
                    query={query}
                    sortOrder={sort.order}
                    sortColumn={sort.column}
                    handleTableHeaderClick={handleTableHeaderClick}
                  />
                  <TableBody>
                    {data[query.table].map((row, rowIndex) => {
                      return (
                        <TableRow hover key={rowIndex}>
                          {query.columns.map(
                            (column, columnIndex) =>
                              // If column is hidden, don't render <td>
                              !query.isHidden(column) && (
                                <TableCell
                                  key={columnIndex}
                                  width={
                                    query.config.columns[column].hasOwnProperty(
                                      "width"
                                    )
                                      ? query.config.columns[column].width
                                      : 0
                                  }
                                >
                                  {query.isPK(column) ? (
                                    <RouterLink
                                      to={`/${query.singleItem}/${row[column]}`}
                                    >
                                      {query.config.columns[
                                        column
                                      ].hasOwnProperty("icon") ? (
                                        <Icon
                                          color={
                                            query.config.columns[column].icon
                                              .color
                                          }
                                        >
                                          {
                                            query.config.columns[column].icon
                                              .name
                                          }
                                        </Icon>
                                      ) : (
                                        row[column]
                                      )}
                                    </RouterLink>
                                  ) : isAlphanumeric(column) ? (
                                    <>
                                      {query.config.columns[
                                        column
                                      ].hasOwnProperty("chip")
                                        ? buildChip(
                                            row[column],
                                            query.config.columns[column].chip
                                          )
                                        : query.getFormattedValue(
                                            column,
                                            row[column]
                                          )}
                                    </>
                                  ) : (
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
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/*Pagination Management*/}
              <GridTablePagination
                query={query}
                data={data}
                pagination={pagination}
                setPagination={setPagination}
              />
            </Card>
          ) : (
            <span>{error ? error : "Could not fetch data"}</span>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default GridTable;
