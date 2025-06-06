import React from "react";
import PropTypes from "prop-types";
import {
  TextField,
  InputAdornment,
  SvgIcon,
  Icon,
  IconButton,
  CircularProgress,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Search as SearchIcon } from "react-feather";
import FiltersChips from "./FiltersChips";
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
}));

/**
 * Renders a search bar with optional filters
 * @param {string} searchFieldValue - The current value of the search field
 * @param {function} setSearchFieldValue - function to update searchFieldValue
 * @param {Object} filters - The current filters from useAdvancedSearch hook
 * @param {function} toggleAdvancedSearch - function to toggle if advanced search (filters) is open
 * @param {Object} advancedSearchAnchor - anchor element for advanced search popper to "attach" to
 * @param {function} handleSearchSubmission - function to handle the search submission
 * @param {Object} queryConfig - the query configuration object with placeholder text
 * @param {Boolean} isOr -  true if ANY filters are matched, false if ALL
 * @param {Boolean} loading - if project list query is loading
 * @param {Object} filtersConfig - The filters configuration for the current table
 * @param {function} resetSimpleSearch - resets search term, search field value and params
 * @return {JSX.Element}
 * @constructor
 */
const SearchBar = ({
  searchFieldValue,
  setSearchFieldValue,
  filters,
  setFilters,
  toggleAdvancedSearch,
  advancedSearchAnchor,
  handleSearchSubmission,
  queryConfig,
  isOr,
  loading,
  filtersConfig,
  resetSimpleSearch,
  setSearchParams,
  setIsOr,
  handleSnackbar,
  searchTerm,
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
      resetSimpleSearch();
    } else {
      setSearchFieldValue(value);
    }
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
        resetSimpleSearch();
        break;
      /**
       * On Enter key, initialize the search
       */
      case "Enter":
        handleSearchSubmission();
        break;

      default:
        return;
    }
  };

  const filterStateActive = filters.length > 0;

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
      {(filterStateActive || searchTerm) && !advancedSearchAnchor && (
        <FiltersChips
          filters={filters}
          setFilters={setFilters}
          filtersConfig={filtersConfig}
          setIsOr={setIsOr}
          isOr={isOr}
          setSearchParams={setSearchParams}
          handleSnackbar={handleSnackbar}
          searchTerm={searchTerm}
        />
      )}
    </>
  );
};

SearchBar.propTypes = {
  className: PropTypes.string,
};

export default SearchBar;
