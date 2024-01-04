import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";

import {
  Button,
  TextField,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Grid,
  Hidden,
  Icon,
  IconButton,
  Grow,
} from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";

import makeStyles from "@mui/styles/makeStyles";

import { Autocomplete } from "@mui/material";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import { LOOKUP_TABLES_QUERY } from "../../queries/project";
import {
  AUTOCOMPLETE_OPERATORS,
  OPERATORS_WITHOUT_SEARCH_VALUES,
} from "src/views/projects/projectsListView/ProjectsListViewFiltersConf";
import { FiltersCommonOperators } from "./FiltersCommonOperators";
import {
  getDefaultOperator,
  makeSearchParamsFromFilterParameters,
} from "src/views/projects/projectsListView/useProjectListViewQuery/useAdvancedSearch";
import {
  advancedSearchFilterParamName,
  advancedSearchIsOrParamName,
} from "src/views/projects/projectsListView/useProjectListViewQuery/useAdvancedSearch";

/**
 * The styling for the filter components
 * @type {Object}
 * @constant
 */
const useStyles = makeStyles((theme) => ({
  root: {},
  filterAlert: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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
 * Generates a copy of an empty field
 * @param uuid
 * @return {Object}
 */
const generateEmptyField = () => {
  /**
   * The default structure of an empty field
   * @type {Object}
   * @property {string} field - The name of the column
   * @property {operator} operator - The name of the operator
   * @property {string[]} availableOperators - A string array containing the names of available operators
   * @property {string} gqlOperator - A string containing the GraphQL operator
   * @property {string} envelope - The a pattern to use as an envelope
   * @property {string} value - The text value to be searched
   * @property {string} type - The type of field it is (string, number, etc.)
   * @constant
   * @default
   */
  const defaultNewFieldState = {
    field: null,
    operator: null,
    availableOperators: [],
    gqlOperator: null,
    envelope: null,
    placeholder: null,
    value: null,
    type: null,
    specialNullValue: null,
    label: null,
  };
  return { ...defaultNewFieldState };
};

/**
 * Get configuration about the filters using the query parameters present in the URL
 * @param {Array} filters - filters from the URL {field, operator, value}
 * @param filtersConfig - The configuration object for the filters
 * @return {Object}
 */
const makeInitialFilterParameters = (filters, filtersConfig) => {
  if (filters.length === 0) return [];

  return filters.map((filter) => {
    const { field, operator, value } = filter;
    const filterConfigForField = filtersConfig.fields.find(
      (fieldConfig) => fieldConfig.name === field
    );
    const operatorsSetInConfig = filterConfigForField.operators;
    const type = filterConfigForField.type;

    const shouldUseAllOperators =
      operatorsSetInConfig.length === 1 &&
      filterConfigForField.operators[0] === "*";
    const availableOperators = shouldUseAllOperators
      ? Object.entries(FiltersCommonOperators)
          .map(([filtersCommonOperator, filterCommonOperatorConfig]) => ({
            ...filterCommonOperatorConfig,
            id: filtersCommonOperator,
          }))
          .filter((operator) => operator.type === type)
      : filterConfigForField.operators.map((operator) => ({
          ...FiltersCommonOperators[operator],
          id: operator,
        }));

    return {
      field,
      operator,
      availableOperators: availableOperators,
      gqlOperator: FiltersCommonOperators[operator].operator,
      placeholder: filterConfigForField.placeholder,
      value,
      type,
      label: filterConfigForField.label,
      lookup_field: filterConfigForField.lookup?.field_name,
      lookup_table: filterConfigForField.lookup?.table_name,
    };
  });
};

/**
 * Returns whether the user input value for the filterParameter is valid
 * @param {object} filterParameter
 * @returns {boolean}
 */
const checkIsValidInput = (filterParameter) => {
  // If we are testing a number type field with a non null value
  if (filterParameter.type === "number" && !!filterParameter.value) {
    // Return whether string only contains digits
    return !/[^0-9]/.test(filterParameter.value);
  }
  return true; // Otherwise the input is valid
};

/**
 * Filter Search Component aka Advanced Search
 * @param {Object} filters - The current filters from useAdvancedSearch hook
 * @param {Function} setFilters - Set the current filters from useAdvancedSearch hook
 * @param {Function} handleAdvancedSearchClose - Used to close the advanced search
 * @param {Object} filtersConfig - The configuration object for the filters
 * @param {Function} setSearchFieldValue - Used to set the search field value
 * @param {Function} setSearchTerm - Used to set the search term for simple search
 * @return {JSX.Element}
 * @constructor
 */
const Filters = ({
  filters,
  setFilters,
  handleAdvancedSearchClose,
  filtersConfig,
  setSearchFieldValue,
  setSearchTerm,
  isOr,
  setIsOr,
}) => {
  /**
   * The styling of the search bar
   * @constant
   * @default
   */
  const classes = useStyles();
  let [, setSearchParams] = useSearchParams();

  const { loading, error, data } = useQuery(LOOKUP_TABLES_QUERY);

  if (error) console.error(error);

  /**
   * The current local filter parameters so that we can store updated filters and
   * then apply them to the query when the search button is clicked.
   * @type {Object} filterParameters - Contains all the current filters
   * @function setFilterParameters - Update the state of filterParameters
   * @default {filters}
   */
  const initialFilterParameters = useMemo(() => {
    if (filters.length > 0) {
      return makeInitialFilterParameters(filters, filtersConfig);
    } else {
      return [generateEmptyField()];
    }
  }, [filters, filtersConfig]);

  const [filterParameters, setFilterParameters] = useState(
    initialFilterParameters
  );
  console.log(filterParameters);

  /* Track toggle value so we update the query value in handleApplyButtonClick */
  const [isOrToggleValue, setIsOrToggleValue] = useState(isOr);

  /**
   * Tracks whether the user has added a complete filter
   */
  const [filterComplete, setFilterComplete] = useState(false);

  /* First filter is an empty placeholder so we check for more than one filter */
  const areMoreThanOneFilters = filterParameters.length > 1;
  const isFirstFilterIncomplete =
    filterParameters.length === 1 && !filterComplete;

  const generateEmptyFilter = useCallback(() => {
    // Clone state and add empty filter
    const filtersNewState = [...filterParameters, generateEmptyField()];
    // Update new state
    setFilterParameters(filtersNewState);
  }, [filterParameters, setFilterParameters]);

  /**
   * Returns true if Field has a lookup table associated with it and operator is case sensitive
   */
  const renderAutocompleteInput = (lookupTable, operator) => {
    return lookupTable && !loading && AUTOCOMPLETE_OPERATORS.includes(operator);
  };

  /**
   * Handles the click event on the field drop-down menu
   * @param {string} filterIndex - filterParameters index to modify
   * @param {Object} field - The field object being clicked
   */
  const handleFilterFieldMenuClick = (filterIndex, field) => {
    // TODO: Update to push update or empty filter into filterParameters array
    console.log(filterIndex);
    // If the filter exists
    if (filterIndex in filterParameters) {
      // Clone state
      const filtersNewState = [...filterParameters];

      // Find the field we need to gather options from
      const fieldDetails = filtersConfig.fields.find(
        (filter) => filter.name === field
      );

      if (!fieldDetails) {
        filtersNewState[filterIndex] = generateEmptyField(filterIndex);
      } else {
        // Update field & type
        filtersNewState[filterIndex].field = fieldDetails.name;
        filtersNewState[filterIndex].type = fieldDetails.type;
        filtersNewState[filterIndex].placeholder = fieldDetails.placeholder;
        filtersNewState[filterIndex].label = fieldDetails.label;

        // Update Available Operators
        if (
          fieldDetails.operators.length === 1 &&
          fieldDetails.operators[0] === "*"
        ) {
          // Add all operators and filter by specific type (defined in fieldDetails.type)
          filtersNewState[filterIndex].availableOperators = Object.keys(
            filtersConfig.operators
          )
            .filter(
              (operator) =>
                filtersConfig.operators[operator].type === fieldDetails.type
            )
            .map((operator) => {
              return {
                ...filtersConfig.operators[operator],
                ...{ id: operator },
              };
            });
        } else {
          // Append listed operators for that field
          filtersNewState[filterIndex].availableOperators =
            fieldDetails.operators.map((operator) => {
              return {
                ...filtersConfig.operators[operator],
                ...{ id: operator },
              };
            });
        }

        // if the field has a corresponding lookup table, add to filterState
        if (fieldDetails.lookup) {
          filtersNewState[filterIndex].lookup_table =
            fieldDetails.lookup.table_name;
          filtersNewState[filterIndex].lookup_field =
            fieldDetails.lookup.field_name;
        }
        // if it does not, reset the variables to null in case the user is editing an existing filter
        else {
          filtersNewState[filterIndex].lookup_table = null;
          filtersNewState[filterIndex].lookup_field = null;
        }
      }

      // Select the default operator, if not defined select first.
      if (fieldDetails) {
        const defaultOperator = getDefaultOperator(fieldDetails);
        handleFilterOperatorClick(filterIndex, defaultOperator);
      }
      // Update the state
      setFilterParameters(filtersNewState);
    } else {
      console.debug(
        `The filter id ${filterIndex} does not exist, ignoring click event.`
      );
    }
  };

  /**
   * Handles the click event on the operator drop-down
   * @param {string} filterIndex - filterParameters index to modify
   * @param {Object} operator - The operator object being clicked
   */
  const handleFilterOperatorClick = (filterIndex, operator, lookupTable) => {
    // Clone state
    const filtersNewState = [...filterParameters];

    if (operator in filtersConfig.operators) {
      // Update operator Value
      filtersNewState[filterIndex].operator = operator;

      // if we are switching to an autocomplete input, clear the search value
      if (renderAutocompleteInput(lookupTable, operator)) {
        filtersNewState[filterIndex].value = null;
      }
    } else {
      // Reset operator value
      filtersNewState[filterIndex].operator = null;
    }

    setFilterParameters(filtersNewState);
  };

  /**
   * Adds an empty filter to the state
   */
  const handleAddFilterButtonClick = () => {
    generateEmptyFilter();
  };

  /**
   * Deletes a filter from the state
   * @param {string} filterIndex - The index of the filter to be deleted
   */
  const handleDeleteFilterButtonClick = (filterIndex) => {
    // Copy the state into a new object
    const filtersNewState = {
      ...filterParameters,
    };
    // Try to delete the filter by filter index
    try {
      // Delete the key (if it's there)
      delete filtersNewState[filterIndex];
    } finally {
      // Finally, reset the state
      const searchParamsFromFilters =
        makeSearchParamsFromFilterParameters(filtersNewState);
      const jsonParamString = JSON.stringify(searchParamsFromFilters);
      setSearchParams((prevSearchParams) => {
        prevSearchParams.set(advancedSearchFilterParamName, jsonParamString);
        return prevSearchParams;
      });
      setFilterParameters(filtersNewState);

      /* Reset isOr to false (all/and) if there is only one filter left */
      if (Object.keys(filtersNewState).length === 1) {
        setIsOr(false);
        setIsOrToggleValue(false);
      }
    }
  };

  /**
   * The user will type a new search value
   * @param {string} filterIndex - filterParameters index to modify
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
   * Clears the filters
   */
  const handleClearFilters = useCallback(() => {
    setFilterParameters([generateEmptyField()]);
    setFilters([]);
    setIsOr(false);

    setSearchParams((prevSearchParams) => {
      prevSearchParams.delete(advancedSearchFilterParamName);
      prevSearchParams.delete(advancedSearchIsOrParamName);
    });
  }, [setSearchParams, setFilters, setIsOr]);

  /**
   * Returns an array of strings containing messages about the filters.
   * Returns null if no problems were found.
   * @return {[]|null}
   */
  const handleApplyValidation = () => {
    let feedback = [];
    if (filterParameters) {
      if (filterParameters.length === 0) {
        feedback.push("• No filters have been added.");
      } else {
        Object.keys(filterParameters).forEach((filterKey) => {
          const { field, value, operator } = filterParameters[filterKey];
          if (field === null) {
            feedback.push("• One or more fields have not been selected.");
          }

          if (operator === null) {
            feedback.push("• One or more operators have not been selected.");
          }

          if (value === null || value.trim() === "") {
            if (operator && !isFilterNullType(operator)) {
              feedback.push("• One or more missing values.");
            }
          }
          if (!checkIsValidInput(filterParameters[filterKey])) {
            feedback.push("• One or more invalid inputs.");
          }
        });
      }
    }
    return feedback.length > 0 ? feedback : null;
  };

  /**
   * Applies the current local state and updates the parent's state
   */
  const handleApplyButtonClick = () => {
    const searchParamsFromFilters =
      makeSearchParamsFromFilterParameters(filterParameters);
    setSearchParams((prevSearchParams) => {
      const jsonParamString = JSON.stringify(searchParamsFromFilters);

      prevSearchParams.set(advancedSearchFilterParamName, jsonParamString);
      prevSearchParams.set(advancedSearchIsOrParamName, isOrToggleValue);
      return prevSearchParams;
    });

    setIsOr(isOrToggleValue);
    setFilters(searchParamsFromFilters);
    handleAdvancedSearchClose();
    // Clear simple search field in UI and state since we are using advanced search
    setSearchFieldValue("");
    setSearchTerm("");
  };

  /**
   * It returns true if the GraphQL operator is null type and has no
   * @param {String} operator - operator to check
   * @returns {boolean}
   */
  const isFilterNullType = (operator) => {
    return operator && OPERATORS_WITHOUT_SEARCH_VALUES.includes(operator);
  };

  // TODO: We can replace this side effect by checking if each filter in filterParameters
  // has a value and operator
  // TODO: Remember to handle filters without values (OPERATORS_WITHOUT_SEARCH_VALUES)
  /**
   * This side effect monitors whether the user has added a complete filter
   */
  useEffect(() => {
    filterParameters.forEach((filter) => {
      if (!!filter.value || isFilterNullType(filter.operator)) {
        setFilterComplete(true);
      } else {
        setFilterComplete(false);
      }
    });
  }, [filterParameters]);

  const handleAndOrToggle = (e) => {
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
              onChange={handleAndOrToggle}
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

      {filterParameters.map((filter, filterIndex) => {
        const isValidInput = checkIsValidInput(filterParameters[filterIndex]);
        // TODO: Clean all this up
        const { field: fieldName, operator, value } = filter;
        const fieldConfig = filtersConfig.fields.find(
          (field) => field.name === fieldName
        );

        const { label, type } = fieldConfig ?? {};
        const { table_name: lookupTable, field_name: lookupField } =
          fieldConfig?.lookup ?? {};
        const operatorsSetInConfig = fieldConfig?.operators;
        const shouldUseAllOperators =
          operatorsSetInConfig &&
          operatorsSetInConfig.length === 1 &&
          fieldConfig.operators[0] === "*";
        let availableOperators = [];

        if (shouldUseAllOperators) {
          availableOperators = Object.entries(FiltersCommonOperators)
            .map(([filtersCommonOperator, filterCommonOperatorConfig]) => ({
              ...filterCommonOperatorConfig,
              id: filtersCommonOperator,
            }))
            .filter((operator) => operator.type === type);
        } else if (operatorsSetInConfig) {
          availableOperators = fieldConfig?.operators.map((operator) => ({
            ...FiltersCommonOperators[operator],
            id: operator,
          }));
        }

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
                    options={filtersConfig.fields}
                    getOptionLabel={(f) =>
                      Object.hasOwn(f, "label") ? f.label : f
                    }
                    onChange={(e, value) => {
                      handleFilterFieldMenuClick(filterIndex, value?.name);
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
                  <InputLabel
                    id={`filter-operator-select-${filterIndex}-label`}
                  >
                    Operator
                  </InputLabel>
                  <Select
                    variant="standard"
                    fullWidth
                    disabled={availableOperators.length === 0}
                    labelId={`filter-operator-select-${filterIndex}-label`}
                    id={`filter-operator-select-${filterIndex}`}
                    value={operator || ""}
                    onChange={(e) =>
                      handleFilterOperatorClick(
                        filterIndex,
                        e.target.value,
                        lookupTable
                      )
                    }
                    label="field"
                    data-testid="operator-select"
                  >
                    {availableOperators.map((operator, operatorIndex) => {
                      return (
                        <MenuItem
                          value={operator.id}
                          key={`filter-operator-select-item-${filterIndex}-${operatorIndex}`}
                          id={`filter-operator-select-item-${filterIndex}-${operatorIndex}`}
                          data-testid={operator.label}
                        >
                          {operator.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} className={classes.gridItemPadding}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
                  {isFilterNullType(operator) !== true &&
                    (renderAutocompleteInput(lookupTable, operator) ? (
                      <Autocomplete
                        value={value || null}
                        options={data[lookupTable]}
                        disabled={!filterParameters[filterIndex].operator}
                        getOptionLabel={(option) =>
                          Object.hasOwn(option, lookupField)
                            ? option[lookupField]
                            : option
                        }
                        onChange={(e, value) => {
                          if (value) {
                            handleSearchValueChange(
                              filterIndex,
                              value[lookupField]
                            );
                          } else {
                            // value is null when the Autocomplete selection is cleared
                            handleSearchValueChange(filterIndex, value);
                          }
                        }}
                        isOptionEqualToValue={(option, value) => {
                          if (Object.hasOwn(value, "name")) {
                            return option.name === value.name;
                          }
                          return option[lookupField] === value;
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
              <Hidden mdDown>
                <Grid item xs={12} md={1} style={{ textAlign: "center" }}>
                  <IconButton
                    disabled={isFirstFilterIncomplete}
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
                    disabled={isFirstFilterIncomplete}
                    fullWidth
                    className={classes.deleteButton}
                    variant="outlined"
                    onClick={() => handleDeleteFilterButtonClick(filterIndex)}
                  >
                    <Icon>delete_outline</Icon>
                  </Button>
                </Grid>
              </Hidden>
            </Grid>
          </Grow>
        );
      })}
      <Grid container spacing={3} id={`filter-options`} key={`filter-options`}>
        <Grid item xs={12} md={2}>
          <Button
            // Disable button until the user has added a complete filter
            disabled={!filterComplete}
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
            onClick={handleClearFilters}
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
            disabled={handleApplyValidation() != null}
          >
            Search
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
