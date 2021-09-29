import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  TextField,
  InputAdornment,
  SvgIcon,
  Icon,
  IconButton,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";

/**
 * Renders a search bar with optional filters
 * @param {GQLAbstract} query - The GQLAbstract object as provided by the parent component
 * @param {Object} searchState - The current state/state-modifier bundle for search
 * @return {JSX.Element}
 * @constructor
 */
const GridTableSearchBar = ({ query, searchState, toggleAdvancedSearch }) => {
  /**
   * The styling of the search bar
   * @constant
   * @default
   */

  /**
   * Attempts to retrieve the default placeholder for the search input field
   * @return {string}
   */
  const getSearchPlaceholder = () => {
    try {
      return query.config.search.placeholder;
    } catch {
      return "Enter search value";
    }
  };

  /**
   * The contents of the search box
   * @type {string} searchFieldValue
   * @function setSearchFieldValue - Sets the state of the field
   * @default {?searchState.searchParameters.value}
   */
  const [searchFieldValue, setSearchFieldValue] = useState(
    (searchState.searchParameters && searchState.searchParameters.value) || ""
  );

  const handleSearchValueChange = value => {
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
  const handleSearchSubmission = event => {
    // Stop if we don't have any value entered in the search field
    if (searchFieldValue.length === 0) {
      return;
    }

    // Prevent default behavior on any event
    if (event) event.preventDefault();

    // Update state if we are ready, triggers search.
    searchState.setSearchParameters({
      value: searchFieldValue,
    });
  };

  /**
   * Clears the search results
   */
  const handleClearSearchResults = () => {
    setSearchFieldValue("");
    searchState.setSearchParameters({});
  };

  /**
   * Handles special keys typed in the search bar
   * @param {string} key - The key name being typed
   */
  const handleKeyDown = key => {
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

  return (
    <TextField
      fullWidth
      onChange={e => handleSearchValueChange(e.target.value)}
      onKeyDown={e => handleKeyDown(e.key)}
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
            <IconButton
              onClick={toggleAdvancedSearch}
            >
              <Icon style={{ verticalAlign: "middle" }}>rule</Icon>
            </IconButton>
          </InputAdornment>
        ),
      }}
      placeholder={getSearchPlaceholder()}
      variant="outlined"
      value={searchFieldValue}
    />
  );
};

GridTableSearchBar.propTypes = {
  className: PropTypes.string,
};

export default GridTableSearchBar;
