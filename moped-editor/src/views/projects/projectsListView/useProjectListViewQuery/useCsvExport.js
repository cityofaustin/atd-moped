import React from "react";
import { useApolloClient } from "@apollo/client";
import { format } from "date-fns";
import Papa from "papaparse";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Button,
  DialogActions,
} from "@mui/material";

export const CsvDownloadingDialog = ({ downloadingDialogOpen }) => (
  <Dialog open={downloadingDialogOpen} aria-labelledby="form-dialog-title">
    <DialogTitle variant="h4" />
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
  </Dialog>
);

export const CsvDownloadOptionsDialog = ({
  dialogOpen,
  handleDialogClose,
  handleContinueButtonClick,
  handleRadioSelect,
  columnDownloadOption,
}) => (
  <Dialog open={dialogOpen} onClose={handleDialogClose}>
    <DialogContent>
      <FormControl>
        <RadioGroup value={columnDownloadOption} onChange={handleRadioSelect}>
          <FormControlLabel
            control={<Radio />}
            label={"Download visible columns"}
            value={"visible"}
          />
          <FormControlLabel
            control={<Radio />}
            label={"Download all columns"}
            value={"all"}
          />
        </RadioGroup>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDialogClose}>Cancel</Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleContinueButtonClick}
      >
        Continue
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
 * @param {string} columnDownloadOption - The column download option selected by user, either "all" or "visible"
 * @param {array} visibleColumns - The columns that are currently visible in the table
 * @return {object}
 */
const buildRecordEntry = (
  record,
  exportConfig,
  columnDownloadOption,
  visibleColumns
) => {
  // Allocate an empty object
  const entry = {};
  const columnsToExport =
    // Based on user selection set columns to download as all or just currently visible
    columnDownloadOption === "visible"
      ? visibleColumns
      : Object.keys(exportConfig);
  // For each column in the export configuration
  columnsToExport.forEach((column) => {
    // check if column exists
    if (!exportConfig[column]) {
      return;
    }
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
 * @param {string} columnDownloadOption - The column download option selected by user, either "all" or "visible"
 * @param {array} visibleColumns - The columns that are currently visible in the table
 * @returns {array}
 */
const formatExportData = (
  data,
  exportConfig,
  columnDownloadOption,
  visibleColumns
) => {
  if (data) {
    return data.map((record) => {
      return buildRecordEntry(
        record,
        exportConfig,
        columnDownloadOption,
        visibleColumns
      );
    });
  }
  return [];
};

export const useCsvExport = ({
  query,
  exportConfig,
  queryTableName,
  setDownloadingDialogOpen,
  setDownloadOptionsDialogOpen,
  columnDownloadOption,
  setColumnDownloadOption,
  visibleColumns,
}) => {
  const client = useApolloClient();

  /**
   * Open the column download options dialog when export button is clicked
   */
  const handleExportButtonClick = () => {
    setDownloadOptionsDialogOpen(true);
  };

  /**
   * Closes the download options dialog when user clicks away or on cancel button
   */
  const handleOptionsDialogClose = () => {
    setDownloadOptionsDialogOpen(false);
  };

  /**
   * Updates the column download option based on user radio button selection
   */
  const handleRadioSelect = (e) => {
    setColumnDownloadOption(e.target.value);
  };

  /**
   * Downloads the csv and opens the downloading dialog when continue button is clicked
   */
  const handleContinueButtonClick = () => {
    setDownloadOptionsDialogOpen(false);
    setDownloadingDialogOpen(true);
    // Fetch data and format, parse, and download CSV when returned
    client
      .query({
        query: query,
        fetchPolicy: "network-first",
      })
      .then(({ data }) => {
        const formattedData = formatExportData(
          data[queryTableName],
          exportConfig,
          columnDownloadOption,
          visibleColumns
        );
        const csvString = Papa.unparse(formattedData, { escapeFormulae: true });
        downloadFile(csvString);
        setDownloadingDialogOpen(false);
      });
  };

  return {
    handleExportButtonClick,
    handleRadioSelect,
    handleContinueButtonClick,
    handleOptionsDialogClose,
  };
};
