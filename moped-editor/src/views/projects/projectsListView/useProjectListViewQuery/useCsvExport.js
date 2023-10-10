import React, { useState } from "react";
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
const downloadFile = (fileContents) => {
  const exportFileName = `moped_projects_${format(Date.now(), "yyyy-MM-dd")}`;
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
 * @param {object} exportConfig - The export configuration
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
 * @param {object} exportConfig - The export configuration
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
}) => {
  /**
   * When True, the download csv dialog is open.
   * @type {boolean} dialogOpen
   * @function setDialogOpen - Sets the state of dialogOpen
   * @default false
   */
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * Instantiates getExport and data variables
   * @function getExport - It is called to load the data
   * @property {object} data - The data as retrieved from query (if available)
   */
  const [getExport] = useLazyQuery(query, {
    fetchPolicy: fetchPolicy,
  });

  /**
   * Handles export button (to open the csv download dialog)
   */
  const handleExportButtonClick = () => {
    setDialogOpen(true);

    // Fetch data and format, parse, and download CSV when returned
    getExport().then(({ data }) => {
      const formattedData = formatExportData(
        data[queryTableName],
        exportConfig
      );
      const csvString = Papa.unparse(formattedData, { escapeFormulae: true });
      downloadFile(csvString);
      setDialogOpen(false);
    });
  };

  /**
   * Handles the closing of the dialog
   */
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return { handleExportButtonClick, dialogOpen, handleDialogClose };
};
