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
  Input,
  FormControlLabel,
  Switch,
  Grid,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import { NavLink as RouterLink } from "react-router-dom";
import { CSVLink } from "react-csv";
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
 * @return {JSX.Element}
 * @constructor
 */
const GridTableExport = ({ query }) => {
  const classes = useStyles();

  // Controls typing timer
  let typingTimer = null;

  const [dialogOpen, setDialogOpen] = useState(false);

  const [initialLimit] = useState(query.limit);
  const [limit, setLimit] = useState(query.limit);
  const [selectAll, setSelectAll] = useState(false);

  // Use .queryCSV to insert columnsToExport prop into query
  let [getExport, { loading, data }] = useLazyQuery(
    query.queryCSV(Object.keys(query.config.export).join(" \n")),
    // Temporary fix for https://github.com/apollographql/react-apollo/issues/3361
    query.config.useQuery
  );

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
    setDialogOpen(false);
  };

  /**
   * Handles the click on the switch to download all
   */
  const handleDownloadAllClick = () => setSelectAll(!selectAll);

  /**
   * Handles the change of the value of the input field
   * @param {string} value - The numeric value that you get from the dialog
   */
  const handleLimitChange = value => {
    // Clear the current timer
    clearTimeout(typingTimer);
    // Start a new timer with a 1/3rd of a second delay.
    typingTimer = setTimeout(() => {
      // Update the state
      setLimit(value);
    }, 333);
  };

  /**
   * Update the export whenever the dialog is open
   */
  useEffect(() => {
    if (dialogOpen) {
      getExport();
    } else {
      // Reset the query limit
      query.limit = initialLimit;
    }
  }, [dialogOpen, getExport, initialLimit, query.limit]);

  /**
   * Update the export whenever limit or selectall change
   */
  useEffect(() => {
    if (dialogOpen) {
      query.limit = limit;
      getExport();
    }
  }, [limit, selectAll, dialogOpen, query.limit, getExport]);

  return (
    <Box display="flex" justifyContent="flex-end">
      {query.config.showExport && (
        <Button
          className={classes.exportButton}
          onClick={handleExportButtonClick}
          startIcon={<Icon>save</Icon>}
        >
          Export CSV
        </Button>
      )}

      {query.config.showNewItemButton && (
        <Button
          color="primary"
          variant="contained"
          component={RouterLink}
          to={query.config.new_item}
          startIcon={<Icon>add_circle</Icon>}
        >
          {query.config.new_item_label}
        </Button>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Export Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the number of records you wish to download, or select "All
            Records" to download all.
          </DialogContentText>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Input
                id="csv-number-input"
                type="number"
                placeholder={
                  selectAll ? "Selecting all rows" : "Number of rows"
                }
                min={0}
                disabled={selectAll === true}
                onChange={e => handleLimitChange(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectAll}
                    onChange={handleDownloadAllClick}
                    name="allRecords"
                    color="primary"
                  />
                }
                label="All Records"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          {!loading && data ? (
            <CSVLink
              className=""
              data={formatExportData(data[query.table])}
              filename={query.table + moment(Date.now()).format()}
            >
              <Button
                onClick={handleDialogClose}
                color="primary"
                startIcon={<Icon>save</Icon>}
              >
                Download
              </Button>
            </CSVLink>
          ) : (
            <CircularProgress />
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

GridTableExport.propTypes = {
  className: PropTypes.string,
};

export default GridTableExport;
