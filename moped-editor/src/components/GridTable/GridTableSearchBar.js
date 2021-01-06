import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  TextField,
  InputAdornment,
  SvgIcon,
  makeStyles,
  Icon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";

/**
 * The styling for the search bar components
 * @type {Object}
 * @constant
 */
const useStyles = makeStyles(theme => ({
  root: {},
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  filterButton: {
    marginTop: theme.spacing(1),
    height: "3.4rem",
  },
  filterButtonFilters: {
    marginTop: theme.spacing(1),
    height: "3.4rem",
    backgroundColor: "#464646",
    "&:hover, &:focus": {
      backgroundColor: "#2b2b2b",
    },
    "&:active": {
      backgroundColor: "#464646",
    },
  },
}));

/**
 * Renders a search bar with optional filters
 * @param {GQLAbstract} query - The GQLAbstract object as provided by the parent component
 * @param {Object} searchState - The current state/state-modifier bundle for search
 * @param {Object} showFilterState - The state/state-modifier bundle for filters
 * @return {JSX.Element}
 * @constructor
 */
const GridTableSearchBar = ({ query, searchState, showFilterState }) => {
  /**
   * The styling of the search bar
   * @constant
   * @default
   */
  const classes = useStyles();

  /**
   * Dialog Open State
   * @type {boolean} dialogOpen - True to show, False to hide
   * @function setDialogOpen - Update the state of confirmDialogOpen
   * @default false
   */
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * The current local filter parameters
   * @type {Object} dialogSettings - Contains the dialog's title, message(s) and actions.
   * @function setDialogSettings - Updates the state of confirmDialogOpen
   * @default false
   */
  const [dialogSettings, setDialogSettings] = useState({
    title: null,
    message: null,
    actions: null,
  });

  /**
   * The contents of the search box
   * @type {string} searchFieldValue
   * @function setSearchFieldValue - Sets the state of the field
   * @default {?searchState.searchParameters.value}
   */
  const [searchFieldValue, setSearchFieldValue] = useState(
    (searchState.searchParameters && searchState.searchParameters.value) || ""
  );

  /**
   * Stores the name of the column to search
   * @type {boolean} fieldToSearch
   * @function setFieldToSearch - Sets the state of the field
   * @default {?searchState.searchParameters.column}
   */
  const [fieldToSearch, setFieldToSearch] = useState(
    (searchState.searchParameters && searchState.searchParameters.column) || ""
  );

  /**
   * True if a field is selected
   * @type {boolean} isFieldSelected - The state of the field being selected
   * @function setIsFieldSelected - Sets the state of isFieldSelected
   * @default false
   */
  const [isFieldSelected, setIsFieldSelected] = useState(
    !!searchState.searchParameters || false
  );

  if (!searchState || !showFilterState)
    return <span>No search or filter state provided</span>;

  if (isFieldSelected) console.debug("Field Selected: ", fieldToSearch);

  /**
   * Closes the dialog
   */
  const handleDialogClose = () => setDialogOpen(false);

  /**
   * The default acknowledge button
   * @type {JSX.Element}
   * @constant
   * @default
   */
  const closeDialogActions = (
    <Button onClick={handleDialogClose} color="primary" autoFocus>
      OK
    </Button>
  );

  /**
   * Handles the submission of our search form
   * @param {Object} e - The event object
   */
  const handleSearchSubmission = event => {
    if (!!event) event.preventDefault();

    if (searchFieldValue.length === 0) {
      setDialogSettings({
        title: "Empty Search Value",
        message: "Enter a valid search value, do not leave empty.",
        actions: closeDialogActions,
      });

      setDialogOpen(true);
    }

    if (fieldToSearch.length === 0) {
      setDialogSettings({
        title: "No Field Selected",
        message: "You must select field to search.",
        actions: closeDialogActions,
      });

      setDialogOpen(true);
    }

    searchState.setSearchParameters({
      column: fieldToSearch,
      value: searchFieldValue,
    });
  };

  /**
   * Clears the search results
   */
  const handleClearSearchResults = () => {
    // clearFilters();
    setSearchFieldValue("");
    setFieldToSearch("");
    setIsFieldSelected(false);
    searchState.setSearchParameters({});
  };

  /**
   * Handles the selection of our search mode in the dropdown
   * @param {Object} e - the event object
   */
  const handleFieldSelect = e => {
    setIsFieldSelected(true);
    setFieldToSearch(e.target.value);
  };

  /**
   * Returns a human-readable label for a specific column
   * @param {string} fieldKey - the raw column name from the database
   * @returns {string}
   */
  const getFieldName = fieldKey => {
    return query.config.columns[fieldKey].search.label;
  };

  const handleKeyDown = key => {
    if (key === "Enter") {
      handleSearchSubmission(null);
    }
  };

  const getSearchPlaceholder = () => {
    try {
      return query.config.search.placeholder;
    } catch {
      return "Enter search value";
    }
  };

  const getSearchDefaultField = () => {
    try {
      return query.config.search.defaultField;
    } catch {
      return "Enter search value";
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={5}>
        <FormControl
          fullWidth
          variant="outlined"
          className={classes.formControl}
        >
          <TextField
            onChange={e => setSearchFieldValue(e.target.value)}
            onKeyDown={e => handleKeyDown(e.key)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon fontSize="small" color="action">
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
            placeholder={getSearchPlaceholder()}
            variant="outlined"
            value={searchFieldValue}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} lg={3}>
        <FormControl
          fullWidth
          variant="outlined"
          className={classes.formControl}
          id="fieldToSearch"
        >
          <InputLabel id="demo-simple-select-outlined-label">Field</InputLabel>
          <Select
            fullWidth
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={
              fieldToSearch !== "" ? fieldToSearch : getSearchDefaultField()
            }
            onChange={handleFieldSelect}
            label="field"
          >
            {query.searchableFields.map((field, fieldIndex) => {
              console.log(getSearchDefaultField() === field);
              return (
                <MenuItem
                  selected={getSearchDefaultField() === field}
                  value={field}
                  key={fieldIndex}
                >
                  {getFieldName(field)}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} lg={2}>
        <Button
          className={classes.filterButton}
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<Icon>search</Icon>}
          onClick={handleSearchSubmission}
        >
          Search
        </Button>
      </Grid>
      <Grid item xs={6} lg={2}>
        <Button
          className={classes.filterButton}
          fullWidth
          variant="outlined"
          color="secondary"
          startIcon={<Icon>backspace</Icon>}
          onClick={handleClearSearchResults}
        >
          Clear
        </Button>
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogSettings.title}
        </DialogTitle>
        <DialogContent>
          {typeof dialogSettings.message === "string" ? (
            <DialogContentText id="alert-dialog-description">
              {dialogSettings.message}
            </DialogContentText>
          ) : (
            dialogSettings.message &&
            dialogSettings.message.map((message, messageIndex) => {
              return (
                <DialogContentText key={messageIndex}>
                  {message}
                </DialogContentText>
              );
            })
          )}
        </DialogContent>
        <DialogActions>{dialogSettings.actions}</DialogActions>
      </Dialog>
    </Grid>
  );
};

GridTableSearchBar.propTypes = {
  className: PropTypes.string,
};

export default GridTableSearchBar;
