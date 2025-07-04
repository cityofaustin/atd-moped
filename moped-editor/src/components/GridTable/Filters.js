import React, { useState } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";

import {
  Button,
  TextField,
  FormControl,
  Grid,
  Hidden,
  Icon,
  IconButton,
  Grow,
  Typography,
} from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

import makeStyles from "@mui/styles/makeStyles";

import { Autocomplete } from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { LOOKUP_TABLES_QUERY } from "src/queries/project";
import {
  advancedSearchFilterParamName,
  advancedSearchIsOrParamName,
} from "src/views/projects/projectsListView/useProjectListViewQuery/useAdvancedSearch";
import { simpleSearchParamName } from "src/views/projects/projectsListView/useProjectListViewQuery/useSearch";
import {
  areAllFiltersComplete,
  checkIsValidInput,
  generateEmptyFilter,
  getDefaultOperator,
  handleApplyValidation,
  isFilterNullType,
  shouldRenderAutocompleteInput,
  useMakeFilterState,
  useCreateAutocompleteOptions,
} from "./helpers";
import { FILTERS_COMMON_OPERATORS } from "src/components/GridTable/FiltersCommonOperators";

/**
 * The styling for the filter components
 * @type {Object}
 * @constant
 */
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  deleteButton: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  deleteIcon: {
    fontSize: "1em",
  },
  gridItemPadding: {
    paddingTop: "2px",
    paddingBottom: "2px",
    paddingRight: "16px",
    paddingLeft: "16px",
    [theme.breakpoints.down("md")]: {
      paddingLeft: 0,
    },
  },
  bottomButton: {
    margin: theme.spacing(1),
    [theme.breakpoints.down("md")]: {
      margin: 0,
    },
    minWidth: "100px",
  },
  applyButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  closeButton: {
    padding: "9px",
  },
  filtersContainer: {
    paddingLeft: "8px",
    marginBottom: "8px",
    [theme.breakpoints.down("md")]: {
      paddingLeft: 0,
    },
  },
}));

/**
 * Filter Search Component aka Advanced Search
 * @param {Function} setFilters - Set the current filters from useAdvancedSearch hook
 * @param {Function} handleAdvancedSearchClose - Used to close the advanced search
 * @param {Object} filtersConfig - The configuration object for the filters
 * @param {Function} resetSimpleSearch - Function to reset the simple search
 * @param {Object} searchParams - The URL search params
 * @param {Function} setSearchParams - Function to set the URL search params
 * @param {string} searchFieldValue - The current search field value
 * @param {Function} setSearchFieldValue - Function to set the search field value
 * @param {Function} setSearchTerm - Function to set the search term
 * @return {JSX.Element}
 * @constructor
 */
const Filters = ({
  setFilters,
  handleAdvancedSearchClose,
  filtersConfig,
  resetSimpleSearch,
  isOr,
  setIsOr,
  searchParams,
  setSearchParams,
  searchFieldValue,
  setSearchFieldValue,
  setSearchTerm,
}) => {
  /**
   * The styling of the search bar
   * @constant
   * @default
   */
  const classes = useStyles();

  const { loading, error, data } = useQuery(LOOKUP_TABLES_QUERY);

  if (error) console.error(error);

  /* Consume existing URL search params or start with an empty filter if none exist */
  const initialFilterParameters = useMakeFilterState({
    searchParams,
    advancedSearchFilterParamName,
    isEmptyFilterNeeded: true,
  });

  /**
   * The current local filter parameters so that we can store updated filters and
   * then apply them to the query when the apply button is clicked.
   * @type {Object} filterParameters - Contains all the current filters
   * @function setFilterParameters - Update the state of filterParameters
   * @default {filters}
   */
  const [filterParameters, setFilterParameters] = useState(
    initialFilterParameters
  );

  /* Track toggle value so we update the query value in handleApplyButtonClick */
  const [isOrToggleValue, setIsOrToggleValue] = useState(isOr);

  /* Some features like all/any radios require more than one filter to appear */
  const areMoreThanOneFilters = filterParameters.length > 1;

  const autocompleteOptionsMap = useCreateAutocompleteOptions(
    filtersConfig,
    data
  );

  /**
   * Handles the click event on the field drop-down menu
   * @param {string} filterIndex - filterParameters index to modify
   * @param {Object} field - The field object being clicked
   */
  const handleFilterFieldMenuChange = (filterIndex, field) => {
    // Clone state
    const filtersNewState = [...filterParameters];

    // Field specific config
    const fieldDetails = filtersConfig[field];

    // Update the field and operator values or handle when the clear X icon is clicked
    if (fieldDetails) {
      const defaultOperator = getDefaultOperator(fieldDetails);

      filtersNewState[filterIndex].field = fieldDetails.name;
      filtersNewState[filterIndex].operator = defaultOperator;

      // if we switch to an operator that does not need a search value, clear the value
      if (isFilterNullType(defaultOperator)) {
        filtersNewState[filterIndex].value = null;
      }
    } else {
      filtersNewState[filterIndex].field = null;
      filtersNewState[filterIndex].operator = null;
    }

    // Update the state
    setFilterParameters(filtersNewState);
  };

  /**
   * Handles the click event on the operator drop-down
   * @param {Number} filterIndex - filterParameters index to modify
   * @param {Object} operator - The operator object being clicked
   * @param {string} lookupTable - The lookup table name
   * @param {Array} lookupOperators - operators set in filter config to show autocomplete
   */
  const handleFilterOperatorChange = (
    filterIndex,
    operator,
    lookupTable,
    lookupOperators
  ) => {
    // Clone state
    const filtersNewState = [...filterParameters];

    // Update operator Value
    filtersNewState[filterIndex].operator = operator;

    // if we are switching to an autocomplete input or using an operator
    // without a search value, clear the search value
    if (
      shouldRenderAutocompleteInput(
        lookupTable,
        operator,
        loading,
        lookupOperators
      ) ||
      isFilterNullType(operator)
    ) {
      filtersNewState[filterIndex].value = null;
    }

    setFilterParameters(filtersNewState);
  };

  /**
   * Adds an empty filter to the state
   */
  const handleAddFilterButtonClick = () => {
    // Clone state and add empty filter
    const filtersNewState = [...filterParameters, generateEmptyFilter()];
    // Update new state
    setFilterParameters(filtersNewState);
  };

  /**
   * Deletes a filter from the state
   * @param {Number} filterIndex - The index of the filter to be deleted
   */
  const handleDeleteFilterButtonClick = (filterIndex) => {
    /* Clone the state, delete the filter index of the button clicked, and update filter state */
    const filtersNewState = [...filterParameters];
    filtersNewState.splice(filterIndex, 1);
    setFilterParameters(filtersNewState);

    const remainingFiltersCount = filtersNewState.length;

    if (remainingFiltersCount === 1) {
      /* Reset isOr to false (all/and) if there is only one filter left */
      setIsOrToggleValue(false);
    }
  };

  /**
   * The user will type a new search value
   * @param {Number} filterIndex - filterParameters index to modify
   * @param {string} value - The value to assign to that filter
   */
  const handleSearchValueChange = (filterIndex, value) => {
    // Clone the state
    const filtersNewState = [...filterParameters];
    // Patch the new state
    filtersNewState[filterIndex].value = value;
    // Update the state
    setFilterParameters(filtersNewState);
  };

  /**
   * Reset search box and advanced filters
   */
  const handleResetFilters = () => {
    setFilterParameters([generateEmptyFilter()]);
    setFilters([]);
    setIsOr(false);
    setSearchParams((prevSearchParams) => {
      prevSearchParams.delete(advancedSearchFilterParamName);
      prevSearchParams.delete(advancedSearchIsOrParamName);
      return prevSearchParams;
    });
    resetSimpleSearch();
  };

  /**
   * Applies the current local state and updates the parent's state
   */
  const handleApplyButtonClick = () => {
    const trimmedSearchFieldValue = searchFieldValue?.trim();
    setSearchFieldValue(trimmedSearchFieldValue);
    setSearchTerm(trimmedSearchFieldValue);

    if (filterParameters.length > 0) {
      // Trim white space from each advanced search filter value
      filterParameters.forEach(
        (filter) => (filter.value = filter.value?.trim())
      );
      /* If we have advanced filters, set query state values and update search params */
      setSearchParams((prevSearchParams) => {
        const jsonParamString = JSON.stringify(filterParameters);
        prevSearchParams.set(advancedSearchFilterParamName, jsonParamString);
        prevSearchParams.set(advancedSearchIsOrParamName, isOrToggleValue);
        if (trimmedSearchFieldValue) {
          prevSearchParams.set(simpleSearchParamName, trimmedSearchFieldValue);
        } else {
          prevSearchParams.delete(simpleSearchParamName);
        }
        return prevSearchParams;
      });

      setIsOr(isOrToggleValue);
      setFilters(filterParameters);
    } else {
      /* Clear search params since we have no advanced filters */
      setSearchParams((prevSearchParams) => {
        prevSearchParams.delete(advancedSearchFilterParamName);
        prevSearchParams.delete(advancedSearchIsOrParamName);
        if (trimmedSearchFieldValue) {
          prevSearchParams.set(simpleSearchParamName, trimmedSearchFieldValue);
        } else {
          prevSearchParams.delete(simpleSearchParamName);
        }
        return prevSearchParams;
      });
      /* If we have no advanced filters, reset query state */
      setFilters([]);
      setIsOr(false);
    }

    handleAdvancedSearchClose();
  };

  const handleAndOrToggleChange = (e) => {
    const isOr = e.target.value === "any";
    setIsOrToggleValue(isOr);
  };

  return (
    <Grid>
      <Grid container className={classes.gridItemPadding}>
        <Grid
          item
          xs={6}
          className={classes.filtersContainer}
          display="flex"
          justifyContent="flex-start"
        >
          {areMoreThanOneFilters ? (
            <RadioGroup
              row
              value={isOrToggleValue ? "any" : "all"}
              onChange={handleAndOrToggleChange}
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                label={
                  <span>
                    Match <strong>all</strong> filters
                  </span>
                }
              />
              <FormControlLabel
                value="any"
                control={<Radio />}
                label={
                  <span>
                    Match <strong>any</strong> filters
                  </span>
                }
              />
            </RadioGroup>
          ) : null}
        </Grid>
        <Grid
          item
          xs={6}
          className={classes.filtersContainer}
          display="flex"
          justifyContent="flex-end"
        >
          <IconButton
            onClick={handleAdvancedSearchClose}
            className={classes.closeButton}
            size="large"
          >
            <Icon fontSize={"small"}>close</Icon>
          </IconButton>
        </Grid>
      </Grid>
      {filterParameters.length === 0 ? (
        <Grid container className={classes.filtersContainer}>
          <Grid item xs={12} md={4} className={classes.gridItemPadding}>
            <Typography>No filters applied</Typography>
          </Grid>
        </Grid>
      ) : null}
      {filterParameters.map((filter, filterIndex) => {
        const { field: fieldName, operator, value } = filter;

        /* Get field configuration and values need for inputs */
        const fieldConfig = filtersConfig[fieldName];
        const { label, type } = fieldConfig ?? {};
        const operators = fieldConfig?.operators ?? [];

        /* If the field uses a lookup table, get the table and field names  */
        const { table_name: lookupTable, operators: lookupOperators } =
          fieldConfig?.lookup ?? {};

        /* Check filter row validity */
        const isValidInput = checkIsValidInput(filter, type);

        return (
          <Grow in={true} key={`filter-grow-${filterIndex}`}>
            <Grid
              container
              id={`filter-${filterIndex}`}
              key={`filter-${filterIndex}`}
              className={classes.filtersContainer}
            >
              {/*Select Field to search from drop-down menu*/}
              <Grid item xs={12} md={4} className={classes.gridItemPadding}>
                <FormControl
                  variant="standard"
                  fullWidth
                  className={classes.formControl}
                >
                  <Autocomplete
                    value={label || null}
                    id={`filter-field-select-${filterIndex}`}
                    options={Object.values(filtersConfig)}
                    getOptionLabel={(f) =>
                      Object.hasOwn(f, "label") ? f.label : f
                    }
                    onChange={(e, value) => {
                      handleFilterFieldMenuChange(filterIndex, value?.name);
                    }}
                    isOptionEqualToValue={(option, value) => {
                      if (Object.hasOwn(value, "name")) {
                        return option.name === value.name;
                      }
                      return option.label === value;
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        autoFocus
                        variant="standard"
                        label={"Field"}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {/*Select the operator from drop-down menu*/}
              <Grid item xs={12} md={3} className={classes.gridItemPadding}>
                <FormControl
                  variant="standard"
                  fullWidth
                  className={classes.formControl}
                >
                  <Autocomplete
                    value={operator || null}
                    id={`filter-operator-select-${filterIndex}`}
                    options={operators}
                    disabled={operators.length === 0}
                    getOptionLabel={(operator) =>
                      FILTERS_COMMON_OPERATORS[operator]?.label || ""
                    }
                    onChange={(e, value) =>
                      handleFilterOperatorChange(
                        filterIndex,
                        value,
                        lookupTable,
                        lookupOperators
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label={"Operator"}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {/* Select or enter value */}
              <Grid item xs={12} md={4} className={classes.gridItemPadding}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
                  {isFilterNullType(operator) !== true &&
                    (shouldRenderAutocompleteInput(
                      lookupTable,
                      operator,
                      loading,
                      lookupOperators
                    ) ? (
                      <Autocomplete
                        value={value || null}
                        options={autocompleteOptionsMap[fieldName]}
                        disabled={!filterParameters[filterIndex].operator}
                        onChange={(e, value) => {
                          handleSearchValueChange(filterIndex, value);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={"Option"}
                          />
                        )}
                      />
                    ) : (
                      <TextField
                        error={!isValidInput}
                        helperText={!isValidInput ? "Must be a number" : ""}
                        key={`filter-search-value-${filterIndex}`}
                        id={`filter-search-value-${filterIndex}`}
                        disabled={!filterParameters[filterIndex].operator}
                        type={type === "date" ? type : null}
                        onChange={(e) =>
                          handleSearchValueChange(filterIndex, e.target.value)
                        }
                        variant="outlined"
                        value={value ?? ""}
                      />
                    ))}
                </FormControl>
              </Grid>
              <>
                <Hidden mdDown>
                  <Grid item xs={12} md={1} style={{ textAlign: "center" }}>
                    <IconButton
                      className={classes.deleteButton}
                      onClick={() => handleDeleteFilterButtonClick(filterIndex)}
                      size="large"
                    >
                      <Icon className={classes.deleteIcon}>delete_outline</Icon>
                    </IconButton>
                  </Grid>
                </Hidden>
                <Hidden mdUp>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      className={classes.deleteButton}
                      variant="outlined"
                      onClick={() => handleDeleteFilterButtonClick(filterIndex)}
                    >
                      <Icon>delete_outline</Icon>
                    </Button>
                  </Grid>
                </Hidden>
              </>
            </Grid>
          </Grow>
        );
      })}
      <Grid container spacing={3} id={`filter-options`} key={`filter-options`}>
        <Grid item xs={12} md={2}>
          <Button
            // Disable button until the user has added a complete filter
            disabled={!areAllFiltersComplete(filterParameters)}
            className={classes.bottomButton}
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<Icon>playlist_add</Icon>}
            onClick={handleAddFilterButtonClick}
          >
            Add Filter
          </Button>
        </Grid>
        <Grid item xs={12} md={1}>
          <Button
            className={classes.bottomButton}
            fullWidth
            variant="outlined"
            startIcon={<BackspaceOutlinedIcon />}
            onClick={handleResetFilters}
          >
            Reset
          </Button>
        </Grid>
        <Hidden mdDown>
          <Grid item xs={12} md={7}>
            {""}
          </Grid>
        </Hidden>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            className={classes.applyButton}
            variant="contained"
            color="primary"
            startIcon={<Icon>search</Icon>}
            onClick={handleApplyButtonClick}
            disabled={
              handleApplyValidation(filterParameters, filtersConfig) !== null
            }
          >
            Apply
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

Filters.propTypes = {
  className: PropTypes.string,
};

export default Filters;
