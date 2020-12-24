import React, { useEffect, useState } from "react";
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
  Link,
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
  // Load up the styles
  const classes = useStyles();
  const { data, loading, error } = useQuery(query.gql);

  /**
   * Data Management
   */
  const items = data ? data[query.config.table] : [];
  let tableRows = [];

  /**
   * State Management
   */
  const [searchKeyword, setSearchKeyword] = useState("");
  const [projectList, setProjectList] = useState([]);

  /**
   * Parses a PostgreSQL timestamp string and returns a human-readable date-time string
   * @param {string} date - The date as provided by the database
   * @return {string} - A human-readable date
   */
  const parseDateReadable = date => {
    return new Date(date).toLocaleDateString();
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
    section.map(item => {
      const val = responseValue(item, keys);
      if (val !== null) {
        map.set(val, true);
        result.push(val);
      }
    });

    return result.join(", "); // Merge all into a string
  };

  /**
   * Returns a Chip object containing the status of the project.
   * @param {string} label - The the text that goes inside the Chip component
   * @param {Object} labelColorMap - The mapping of label to Material color name
   * @param {string} defaultLabel - The the text that goes inside the Chip component
   * @return {JSX.Element}
   */
  const buildChip = (label, labelColorMap, defaultLabel="No Status") => {
    const cleanLabel = cleanUpText(label);
    return String(label) !== "" ? (
      <Chip
        color={labelColorMap[cleanLabel.toLowerCase()] || "disabled"}
        size={"small"}
        label={cleanLabel} lable
      />
    ) : (
      <span>{defaultLabel}</span>
    );
  };

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (data) {
      const currentProjectList = data.moped_project.filter(item => {
        return item.project_name
          .toString()
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
      });
      setProjectList(currentProjectList);
    }
  }, [data, searchKeyword]);

  return (
    <Container maxWidth={false} className={classes.root}>
      <Typography
        variant="h1"
        component="h2"
        align="left"
        className={classes.title}
      >
        {title}
      </Typography>
      <GridTableToolbar>{toolbar}</GridTableToolbar>
      <Paper className={classes.paper}>
        <Box mt={3}>
          {loading ? (
            <CircularProgress />
          ) : data ? (
            <Card className={classes.root}>
              <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                  <GridTableListHeader query={query} />
                  <TableBody>
                    {data[query.table].map((row, rowIndex) => {
                      return (
                        <TableRow hover key={rowIndex}>
                          {query.columns.map(
                            (column, columnIndex) =>
                              // If column is hidden, don't render <td>
                              !query.isHidden(column) && (
                                <TableCell key={columnIndex}>
                                  {query.isPK(column) ? (
                                    <RouterLink
                                      to={`/${query.singleItem}/${row[column]}`}
                                    >
                                      {query.config.columns[
                                        "project_id"
                                      ].hasOwnProperty("icon") ? (
                                        <Icon color={"primary"}>edit_road</Icon>
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
              <GridTablePagination query={query} data={data} />
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
