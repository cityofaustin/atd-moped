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
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";

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
    marginTop: theme.spacing(2),
  },
  filterButtonFilters: {
    marginTop: theme.spacing(2),
    backgroundColor: "#464646",
    "&:hover, &:focus": {
      backgroundColor: "#2b2b2b",
    },
    "&:active": {
      backgroundColor: "#464646",
    },
  },
}));

const GridTableSearch = ({ query, searchState, filtersState }) => {
  /**
   * If we are not provided a search or field state, then render a message
   */
  const classes = useStyles();

  /**
   * The contents of the search box
   *  {string} searchFieldValue - Default: searchState.searchParameters.value
   */
  const [searchFieldValue, setSearchFieldValue] = useState(
    (searchState.searchParameters && searchState.searchParameters.value) || ""
  );

  /**
   * Stores the name of the column to search
   * {string} fieldToSearch - Default: searchState.searchParameters.column or None
   */
  const [fieldToSearch, setFieldToSearch] = useState(
    (searchState.searchParameters && searchState.searchParameters.column) || ""
  );
  /**
   *  {boolean} isFieldSelected - True if a field is selected.
   *          Default: False
   */
  const [isFieldSelected, setIsFieldSelected] = useState(
    !!searchState.searchParameters || false
  );

  if (!searchState || !filtersState)
    return <span>No search or filter state provided</span>;

  /**
   * Handles the submission of our search form
   * @param {object} e - the event object
   */
  const handleSearchSubmission = e => {
    e.preventDefault();

    searchState.setSearchParameters({
      column: fieldToSearch,
      value: searchFieldValue,
    });

    // resetPage();
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
   * @param {object} e - the event object
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
    return query.getLabel(fieldKey, "search");
  };

  /**
   * Toggles Showing filters
   */
  const handleFiltersClick = () => {
    filtersState.setShowFilters(!filtersState.showFilters);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <FormControl
          fullWidth
          variant="outlined"
          className={classes.formControl}
        >
          <TextField
            onChange={e => setSearchFieldValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SvgIcon fontSize="small" color="action">
                    <SearchIcon />
                  </SvgIcon>
                </InputAdornment>
              ),
            }}
            placeholder="Search project name, description"
            variant="outlined"
            value={searchFieldValue}
          />
        </FormControl>
      </Grid>
      <Grid item xs={3}>
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
            value={fieldToSearch}
            onChange={handleFieldSelect}
            label="field"
          >
            <MenuItem value="" disabled>
              <em>Select a field</em>
            </MenuItem>
            <MenuItem value={"project_name"}>Project Name</MenuItem>
            <MenuItem value={"project_description"}>Description</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={1}>
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
      <Grid item xs={1}>
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
      <Grid item xs={1}>
        <Button
          className={classes.filterButtonFilters}
          fullWidth
          variant="contained"
          color="secondary"
          startIcon={<Icon>rule</Icon>}
          onClick={handleFiltersClick}
        >
          Filters
        </Button>
      </Grid>
    </Grid>
  );
};

GridTableSearch.propTypes = {
  className: PropTypes.string,
};

export default GridTableSearch;
