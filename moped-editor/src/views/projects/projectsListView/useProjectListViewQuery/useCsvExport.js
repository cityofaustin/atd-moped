import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { format } from "date-fns";
import Papa from "papaparse";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";

export const CsvDownloadDialog = ({ dialogOpen, handleDialogClose }) => (
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
);

/**
 * Downloads the contents of fileContents into a file
 * @param {string} fileContents
 */
const downloadFile = (fileContents, queryTableName) => {
  const exportFileName =
    "moped-" + queryTableName + format(Date.now(), "yyyy-MM-dd'T'HH:mm:ssxxx");
  const blob = new Blob([fileContents], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    link.style.visibility = "hidden";
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", exportFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Builds a record entry given a specific configuration and filters
 * @param {object} record - The record to build
 * @return {object}
 */
const buildRecordEntry = (record, exportConfig) => {
  // Allocate an empty object
  const entry = {};
  // For each column in the export configuration
  Object.keys(exportConfig).forEach((column) => {
    // column label and data formatting function
    const { label, filter } = exportConfig[column];
    // Determine the new column name, if available.
    const newColumnName = label ? label : column;
    // If there is a filter, use it. Assign the value to the new column name.
    entry[newColumnName] = filter ? filter(record[column]) : record[column];
  });
  return entry;
};

/**
 * Returns an array of objects (each object is a row and each key of that object is a column in the export file)
 * @param {array} data - Data returned from DB with nested data structures
 * @returns {array}
 */
const formatExportData = (data, exportConfig) => {
  if (data) {
    return data.map((record) => {
      return buildRecordEntry(record, exportConfig);
    });
  }
  return [];
};

export const useCsvExport = ({
  query,
  exportConfig,
  queryTableName,
  fetchPolicy,
  limit,
  setQueryLimit,
}) => {
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
    query,
    // Temporary fix for https://github.com/apollographql/react-apollo/issues/3361
    fetchPolicy
  );

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
   * Update the export whenever limit or selectall change
   */
  useEffect(
    () => {
      if (dialogOpen && !downloading) {
        getExport();
        setDownloading(true);
      }

      if (dialogOpen && downloading && data && !loading) {
        const formattedData = formatExportData(
          data[queryTableName],
          exportConfig
        );
        // use the papaparse library to "unparse" a json object to csv
        // escapeFormulae: "field values that begin with =, +, -, @, \t, or \r, will be prepended with a ' to defend
        // against injection attacks because Excel and LibreOffice will automatically parse such cells as formulae."
        const csvString = Papa.unparse(formattedData, { escapeFormulae: true });
        setTimeout(() => {
          // Update the state
          setDialogOpen(false);
          downloadFile(csvString, queryTableName);
          setDownloading(false);
        }, 1500);
      }
    },
    // eslint-disable-next-line
    [dialogOpen, downloading, loading, limit, getExport, setQueryLimit]
  );

  return { handleExportButtonClick, dialogOpen, handleDialogClose };
};
