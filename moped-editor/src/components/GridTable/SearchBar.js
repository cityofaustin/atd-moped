import React from "react";
import PropTypes from "prop-types";

import {
  Button,
  Box,
  TextField,
  InputAdornment,
  SvgIcon,
  Hidden,
  Icon,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Search as SearchIcon } from "react-feather";
import clsx from "clsx";

/**
 * The styling for the search bar components
 * @type {Object}
 * @constant
 */
const useStyles = makeStyles((theme) => ({
  advancedSearchSelected: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    height: "33px",
    width: "33px",
    color: "rgba(0, 0, 0, 0.54)",
  },
  advancedSearchActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.paper,
    height: "33px",
    width: "33px",
  },
  tuneIcon: {
    height: "33px",
    width: "33px",
    color: "rgba(0, 0, 0, 0.54)",
  },
  searchButton: {
    marginTop: "12px",
  },
  filtersList: {
    padding: "8px",
    marginRight: "12px",
  },
  filtersText: {
    fontSize: ".9rem",
    color: theme.palette.text.secondary,
  },
  filtersSpan: {
    fontWeight: 600,
    textTransform: "uppercase",
  },
}));

/**
 * Create text to show advanced filters and logic applied in the UI
 * @param {Object} filters - The current filters applied
 * @param {Boolean} isOr - The current logic applied
 * @returns {string} - The text to display
 */
const makeFilteredByText = (filters, isOr) => {
  const filtersCount = Object.keys(filters).length;
  let filteredByText = "Filtered by ";

  /* Only show logic string if more than one filter applied */
  if (filtersCount === 1) return filteredByText;

  if (isOr) {
    filteredByText += "any ";
  } else {
    filteredByText += "all ";
  }

  return filteredByText;
};

/**
 * Renders a search bar with optional filters
 * @param {string} searchFieldValue - The current value of the search field
 * @param {function} setSearchFieldValue - function to set the current value of the search field
 * @param {Object} filters - The current filters from useAdvancedSearch hook
 * @param {function} toggleAdvancedSearch - function to toggle if advanced search (filters) is open
 * @param {Object} advancedSearchAnchor - anchor element for advanced search popper to "attach" to
 * @param {Function} setSearchTerm - set the current search term set in the query
 * @param {Object} queryConfig - the query configuration object with placeholder text
 * @param {Object} filtersConfig - The filters configuration for the current table
 * @return {JSX.Element}
 * @constructor
 */
const SearchBar = ({
  searchFieldValue,
  setSearchFieldValue,
  filters,
  toggleAdvancedSearch,
  advancedSearchAnchor,
  setSearchTerm,
  queryConfig,
  isOr,
  handleSwitchToSearch,
  loading,
  filtersConfig,
}) => {
  const classes = useStyles();

  /**
   * Attempts to retrieve the default placeholder for the search input field
   * @return {string}
   */
  const getSearchPlaceholder = () => {
    try {
      return queryConfig.search.placeholder;
    } catch {
      return "Enter search value";
    }
  };

  const handleSearchValueChange = (value) => {
    if (value === "" && searchFieldValue !== "") {
      handleClearSearchResults();
    } else {
      setSearchFieldValue(value);
    }
  };

  /**
   * Handles the submission of our search form
   * @param {Object} e - The event object
   */
  const handleSearchSubmission = (event) => {
    // Stop if we don't have any value entered in the search field
    if (searchFieldValue.length === 0) {
      return;
    }

    // Prevent default behavior on any event
    if (event) event.preventDefault();

    // Clear the advanced search filters
    handleSwitchToSearch();

    // Update state if we are ready, triggers search.
    setSearchTerm(searchFieldValue);
    // TODO: Set search params here
  };

  /**
   * Clears the search results
   */
  const handleClearSearchResults = () => {
    setSearchTerm("");
    setSearchFieldValue("");
  };

  /**
   * Handles special keys typed in the search bar
   * @param {string} key - The key name being typed
   */
  const handleKeyDown = (key) => {
    switch (key) {
      /**
       * On Escape key, clear the search
       */
      case "Escape":
        handleClearSearchResults();
        break;
      /**
       * On Enter key, initialize the search
       */
      case "Enter":
        handleSearchSubmission(null);
        break;

      default:
        return;
    }
  };

  const filterStateActive = filters.length > 0;
  const filtersApplied =
    filterStateActive &&
    filters.map((filter) => {
      const fieldFilterConfig = filtersConfig.fields.find(
        (fieldConfig) => fieldConfig.name === filter.field
      );
      return fieldFilterConfig.label;
    });

  return (
    <>
      <TextField
        fullWidth
        autoFocus
        inputProps={{
          style: {
            paddingTop: 12,
            paddingBottom: 12,
          },
        }}
        onChange={(e) => handleSearchValueChange(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e.key)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SvgIcon fontSize="small" color="action">
                <SearchIcon />
              </SvgIcon>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {!!loading && (
                <IconButton>
                  <CircularProgress size="2rem" />
                </IconButton>
              )}
              <IconButton
                onClick={toggleAdvancedSearch}
                className={clsx({
                  [classes.tuneIcon]: !filterStateActive,
                  [classes.advancedSearchSelected]: advancedSearchAnchor,
                  [classes.advancedSearchActive]: filterStateActive,
                })}
                data-testid="advanced-filter-button"
                size="large"
              >
                <Icon style={{ verticalAlign: "middle" }}>tune</Icon>
              </IconButton>
            </InputAdornment>
          ),
        }}
        placeholder={getSearchPlaceholder()}
        variant="outlined"
        value={searchFieldValue}
      />
      {filterStateActive && (
        <Box className={classes.filtersList}>
          <Typography align="right" className={classes.filtersText}>
            {makeFilteredByText(filters, isOr)}{" "}
            <span className={classes.filtersSpan}>{`${filtersApplied.join(
              ", "
            )}`}</span>
          </Typography>
        </Box>
      )}
      <Hidden smUp>
        <Button
          className={classes.searchButton}
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<Icon>search</Icon>}
          onClick={handleSearchSubmission}
        >
          Search
        </Button>
      </Hidden>
    </>
  );
};

SearchBar.propTypes = {
  className: PropTypes.string,
};

export default SearchBar;
