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
} from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Filters from "src/components/GridTable/Filters";
import SearchBar from "./SearchBar";
import makeStyles from "@mui/styles/makeStyles";
import { useLazyQuery } from "@apollo/client";
import { format } from "date-fns";
import Papa from "papaparse";

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
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "12px",
    },
  },
  advancedSearchRoot: {
    width: "calc(100% - 32px)",
    zIndex: "3",
    paddingLeft: "16px",
    paddingRight: "16px",
    [theme.breakpoints.down("md")]: {
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
 * * @param {GQLAbstract} query - The GQLAbstract object as provided by the parent component
 * @param {Object} filters - The current filters from useAdvancedSearch hook
 * @param {Function} setFilters - Set the current filters from useAdvancedSearch hook
 * @param {Object} parentData - Response data (if any) from the parent component
 * @param {Object} advancedSearchAnchor - The anchor element for the advanced search popper
 * @param {Function} setAdvancedSearchAnchor - Set the anchor element for the advanced search popper
 * @param {String} searchTerm - The current search term from useSearch hook
 * @param {Function} setSearchTerm - Set the current search term from useSearch hook
 * @param {Object} queryConfig - The query configuration for the current table
 * @param {Object} filtersConfig - The filters configuration for the current table
 * @return {JSX.Element}
 * @constructor
 */
const Search = ({
  query,
  filters,
  setFilters,
  filterQuery,
  parentData = null,
  advancedSearchAnchor,
  setAdvancedSearchAnchor,
  searchTerm,
  setSearchTerm,
  queryConfig,
  filtersConfig,
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
   * Downloads the contents of fileContents into a file
   * @param {string} fileContents
   */
  const downloadFile = (fileContents) => {
    const exportFileName =
      "moped-" + query.table + format(Date.now(), "yyyy-MM-dd'T'HH:mm:ssxxx");
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
      // column label and data formatting function
      const { label, filter } = query.config.export[column];
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
    setFilters({});
    filterQuery.delete("filter");
    history.replace(`${queryPath}?`);
  };

  /**
   * Clears the simple search when switching to filters
   */
  const handleSwitchToAdvancedSearch = () => {
    setSearchTerm("");
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
        // use the papaparse library to "unparse" a json object to csv
        // escapeFormulae: "field values that begin with =, +, -, @, \t, or \r, will be prepended with a ' to defend
        // against injection attacks because Excel and LibreOffice will automatically parse such cells as formulae."
        const csvString = Papa.unparse(formattedData, { escapeFormulae: true });
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
              <SearchBar
                filters={filters}
                setFilters={setFilters}
                toggleAdvancedSearch={toggleAdvancedSearch}
                advancedSearchAnchor={advancedSearchAnchor}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                queryConfig={queryConfig}
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
          <Filters
            query={query}
            filters={filters}
            setFilters={setFilters}
            filterQuery={filterQuery}
            history={history}
            handleAdvancedSearchClose={handleAdvancedSearchClose}
            filtersConfig={filtersConfig}
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

Search.propTypes = {
  className: PropTypes.string,
};

export default Search;
