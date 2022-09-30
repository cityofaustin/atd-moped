import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createBrowserHistory } from "history";
import { useLocation } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Popper,
} from "@material-ui/core";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import GridTableFilters from "./GridTableFilters";
import GridTableSearchBar from "./GridTableSearchBar";
import GridTableNewItem from "./GridTableNewItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useLazyQuery } from "@apollo/client";
import { format } from "date-fns";
import { get } from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  downloadButtonGrid: {
    padding: "12px",
  },
  downloadCsvButton: {
    height: "43px",
  },
  tabStyle: {
    margin: ".5rem",
  },
  searchBarContainer: {
    padding: "2px",
    [theme.breakpoints.down("xs")]: {
      paddingBottom: "12px",
    },
  },
  advancedSearchRoot: {
    width: "calc(100% - 32px)",
    zIndex: "3",
    paddingLeft: "16px",
    paddingRight: "16px",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "23px",
      paddingRight: "14px",
    },
  },
  advancedSearchPaper: {
    paddingTop: "0px",
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    boxShadow:
      "rgb(0 0 0 / 31%) 0px 0px 1px 0px, rgb(0 0 0 / 25%) 0px 3px 4px -2px",
  },
  gridSearchPadding: {
    padding: "12px",
  },
}));

const history = createBrowserHistory();

/**
 * Renders a table search component with a search bar and search filters
 * @param {GQLAbstract} query - The GQLAbstract object as provided by the parent component
 * @param {Object} searchState - The current state/state-modifier bundle for search
 * @param {Object} filterState - The current state/state-modifier bundle for filters
 * @param {JSX.Element} children - Any components to be rendered above the search bar
 * @param {Object} parentData - Response data (if any) from the parent component
 * @return {JSX.Element}
 * @constructor
 */
const GridTableSearch = ({
  query,
  searchState,
  filterState,
  children,
  filterQuery,
  parentData = null,
  advancedSearchAnchor,
  setAdvancedSearchAnchor,
}) => {
  const classes = useStyles();
  const queryPath = useLocation().pathname;
  const divRef = React.useRef();

  /**
   * When True, the download csv dialog is open.
   * @type {boolean} dialogOpen
   * @function setDialogOpen - Sets the state of dialogOpen
   * @default false
   */
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * When True, the download happens.
   * @type {boolean} downloading
   * @function setDownloading - Sets the state of downloading
   * @default false
   */
  const [downloading, setDownloading] = useState(false);

  /**
   * Instantiates getExport, loading and data variables
   * @function getExport - It is called to load the data
   * @property {boolean} loading - True whenever the data is being loaded
   * @property {object} data - The data as retrieved from query (if available)
   */
  let [getExport, { called, stopPolling, loading, data }] = useLazyQuery(
    query.queryCSV(Object.keys(query.config.export).join(" \n")),
    // Temporary fix for https://github.com/apollographql/react-apollo/issues/3361
    query.config.useQuery
  );

  /**
   * Generates a sanitized string for CSV
   * @param {*} value - Any value
   * @return {string}
   */
  const dataSanitizeValueExport = (value) => {
    return typeof value !== "number" ? `"${value}"` : String(value);
  };

  /**
   * Retrieves a list of headers for the data
   * @param {Array} data - The data payload
   * @return {string[]}
   */
  const dataGetHeaders = (data) => {
    return Array.isArray(data)
      ? Object.keys(data[0]).filter((key) => key !== "__typename")
      : [];
  };

  /**
   * Converts a single data entry into a CSV line
   * @param {string[]} headers - The list of headers that determines the order
   * @param {Object} data - The data as provided by Hasura
   * @return {string}
   */
  const dataToCSV = (headers, data) => {
    return (
      headers.join(",") +
      "\n" +
      data
        .map((item) => {
          return headers
            .map((key) => dataSanitizeValueExport(item[key]))
            .join(",");
        })
        .join("\n")
    );
  };

  /**
   * Downloads the contents of fileContents into a file
   * @param {string} fileContents
   */
  const downloadFile = (fileContents) => {
    const exportFileName =
      query.table + format(Date.now(), "yyyy-MM-dd'T'HH:mm:ssxxx");
    const blob = new Blob([fileContents], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      link.style.visibility = "hidden";
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", exportFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }
  };

  /**
   * Builds a record entry given a specific configuration and filters
   * @param {object} record - The record to build
   * @return {object}
   */
  const buildRecordEntry = (record) => {
    // Allocate an empty object
    const entry = {};
    // For each column in the export configuration
    Object.keys(query.config.export).forEach((column) => {
      // Extract the label, filter, and path
      const { label, filter, path } = query.config.export[column];
      // Determine the new column name, if available.
      const newColumnName = label ? label : column;
      // If it's a nested graphql expression, use lodash get and
      // the path to get to the value, otherwise, assign the value.
      const value = query.isNestedKey(column)
        ? get(record, path)
        : record[column];
      // If there is a filter, use it. Assign the value to the new column name.
      entry[newColumnName] = filter ? filter(value) : value;
    });
    // Return new object
    return entry;
  };

  /**
   * Returns an array of objects (each object is a row and each key of that object is a column in the export file)
   * @param {array} data - Data returned from DB with nested data structures
   * @returns {array}
   */
  const formatExportData = (data) => {
    if (data) {
      return data.map((record) => {
        return buildRecordEntry(record);
      });
    }
    return [];
  };

  /**
   * Handles export button (to open the csv download dialog)
   */
  const handleExportButtonClick = () => {
    setDialogOpen(true);
  };

  /**
   * Handles the closing of the dialog
   */
  const handleDialogClose = () => {
    if (called) stopPolling();
    setDialogOpen(false);
  };

  /**
   * Clears the filters when switching to simple search
   */
  const handleSwitchToSearch = () => {
    filterState.setFilterParameters({});
    filterQuery.delete("filter");
    history.replace(`${queryPath}?`);
  };

  /**
   * Clears the simple search when switching to filters
   */
  const handleSwitchToAdvancedSearch = () => {
    searchState.setSearchParameters({
      value: "",
      column: "",
    });
  };

  const toggleAdvancedSearch = () => {
    if (advancedSearchAnchor) {
      setAdvancedSearchAnchor(null);
      handleSwitchToSearch();
    } else {
      setAdvancedSearchAnchor(divRef.current);
      handleSwitchToAdvancedSearch();
    }
  };

  const handleAdvancedSearchClose = () => {
    setAdvancedSearchAnchor(null);
  };

  /**
   * Update the export whenever limit or selectall change
   */
  useEffect(
    () => {
      if (dialogOpen && !downloading) {
        query.limit = 0;
        getExport();
        setDownloading(true);
      }

      if (dialogOpen && downloading && data && !loading) {
        const formattedData = formatExportData(data[query.table]);
        const headers = dataGetHeaders(formattedData);
        const csvString = dataToCSV(headers, formattedData);
        setTimeout(() => {
          // Update the state
          setDialogOpen(false);
          downloadFile(csvString);
        }, 1500);
      }
    },
    // eslint-disable-next-line
    [dialogOpen, downloading, loading, query.limit, getExport]
  );

  return (
    <div>
      {query.config.showNewItemButton && <GridTableNewItem query={query} />}
      {children}
      <Box mt={3}>
        <Paper ref={divRef}>
          <Grid container className={classes.searchBarContainer}>
            <Grid
              item
              xs={12}
              sm={8}
              lg={10}
              className={classes.gridSearchPadding}
            >
              <GridTableSearchBar
                query={query}
                searchState={searchState}
                filterState={filterState}
                toggleAdvancedSearch={toggleAdvancedSearch}
                advancedSearchAnchor={advancedSearchAnchor}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              lg={2}
              className={classes.downloadButtonGrid}
            >
              {query.config.showExport && (
                <Button
                  disabled={
                    (parentData?.[query.config.table] ?? []).length === 0
                  }
                  className={classes.downloadCsvButton}
                  onClick={handleExportButtonClick}
                  startIcon={<SaveAltIcon />}
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  Download
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <Popper
        id="advancedSearch"
        open={Boolean(advancedSearchAnchor)}
        anchorEl={advancedSearchAnchor}
        onClose={handleAdvancedSearchClose}
        placement={"bottom"}
        className={classes.advancedSearchRoot}
      >
        <Paper className={classes.advancedSearchPaper}>
          <GridTableFilters
            query={query}
            filterState={filterState}
            filterQuery={filterQuery}
            history={history}
            handleAdvancedSearchClose={handleAdvancedSearchClose}
          />
        </Paper>
      </Popper>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title"> </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={2} lg={2}>
              <CircularProgress />
            </Grid>
            <Grid item xs={10} lg={10}>
              <DialogContentText>
                Preparing download, please wait.
              </DialogContentText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

GridTableSearch.propTypes = {
  className: PropTypes.string,
};

export default GridTableSearch;
