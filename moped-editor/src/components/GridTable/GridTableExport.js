import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";

import {
  Box,
  Button,
  Icon,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Grid,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import { NavLink as RouterLink } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1),
  },
  exportButton: {
    marginRight: theme.spacing(1),
  },
}));

/**
 * Renders the GridTableExport functionality
 * @param {GQLAbstract} query - The GQLAbstract query object that provides the configuration
 * @param {Object} showFilterState - The state/state-change bundle object
 * @return {JSX.Element}
 * @constructor
 */
const GridTableExport = ({ query, showFilterState }) => {
  const classes = useStyles();

  /**
   * When True, the dialog is open.
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
  }

  /**
   * Retrieves a list of headers for the data
   * @param {Array} data - The data payload
   * @return {string[]}
   */
  const dataGetHeaders = data => {
    return Array.isArray(data)
      ? Object.keys(data[0]).filter(key => key !== "__typename")
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
        .map(item => {
          return headers.map(key => dataSanitizeValueExport(item[key])).join(",");
        })
        .join("\n")
    );
  };

  /**
   * Downloads the contents of fileContents into a file
   * @param {string} fileContents
   */
  const downloadFile = fileContents => {
    const exportFileName = query.table + moment(Date.now()).format();
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
  const buildRecordEntry = record => {
    // Allocate an empty object
    const entry = {};
    // For each column in the export configuration
    Object.keys(query.config.export).forEach(column => {
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
  const formatExportData = data => {
    if (data) {
      return data.map(record => {
        return buildRecordEntry(record);
      });
    }
    return [];
  };

  /**
   * Handles export button (to open the dialog)
   */
  const handleExportButtonClick = () => {
    setDialogOpen(true);
  };

  /**
   * Handles the closing of the dialog
   */
  const handleDialogClose = () => {
    if(called) stopPolling();
    setDialogOpen(false);
  };

  /**
   * Toggles Showing filters
   */
  const handleFiltersClick = () => {
    showFilterState.setShowFilters(!showFilterState.showFilters);
  };

  /**
   * Update the export whenever limit or selectall change
   */
  useEffect(() => {
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
  [dialogOpen, downloading, loading, query.limit, getExport]);

  return (
    <Box display="flex" justifyContent="flex-end">
      {query.config.showExport && (
        <Button
          className={classes.exportButton}
          onClick={handleFiltersClick}
          startIcon={
            <Icon>{showFilterState.showFilters ? "search" : "rule"}</Icon>
          }
        >
          {showFilterState.showFilters ? "General Search" : "Filter Search"}
        </Button>
      )}

      {query.config.showExport && (
        <Button
          className={classes.exportButton}
          onClick={handleExportButtonClick}
          startIcon={<Icon>save</Icon>}
        >
          Export CSV
        </Button>
      )}

      {(query.config.showNewItemButton && query.config.customNewItemButton) ||
        (query.config.showNewItemButton && (
          <Button
            color="primary"
            variant="contained"
            component={RouterLink}
            to={query.config.new_item}
            startIcon={<Icon>add_circle</Icon>}
          >
            {query.config.new_item_label}
          </Button>
        ))}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{" "}</DialogTitle>
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
    </Box>
  );
};

GridTableExport.propTypes = {
  className: PropTypes.string,
};

export default GridTableExport;
