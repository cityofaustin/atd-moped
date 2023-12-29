import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
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
const generateEmptyField = (uuid) => {
  /**
   * The default structure of an empty field
   * @type {Object}
   * @property {string} id - The uuid of the field
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
    id: null,
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
  return { ...defaultNewFieldState, id: uuid };
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
      return {
        [uuidv4()]: generateEmptyField(uuidv4()),
      };
    }
  }, [filters, filtersConfig]);
  console.log(initialFilterParameters);

  const [filterParameters, setFilterParameters] = useState(
    initialFilterParameters
  );

  /* Track toggle value so we update the query value in handleApplyButtonClick */
  const [isOrToggleValue, setIsOrToggleValue] = useState(isOr);

  /**
   * Tracks whether the user has added a complete filter
   */
  const [filterComplete, setFilterComplete] = useState(false);

  /* First filter is an empty placeholder so we check for more than one filter */
  const areMoreThanOneFilters = Object.keys(filterParameters).length > 1;
  const isFirstFilterIncomplete =
    Object.keys(filterParameters).length === 1 && !filterComplete;

  const generateEmptyFilter = useCallback(() => {
    // Generate a random UUID string
    const uuid = uuidv4();
    // Clone state
    const filtersNewState = {
      ...filterParameters,
    };
    // Patch new state
    filtersNewState[uuid] = generateEmptyField(uuid);
    // Update new state
    setFilterParameters(filtersNewState);
  }, [filterParameters, setFilterParameters]);

  /**
   * Returns true if Field has a lookup table associated with it and operator is case sensitive
   */
  const renderAutocompleteInput = (field) => {
    return (
      field.lookup_table &&
      !loading &&
      AUTOCOMPLETE_OPERATORS.includes(field.operator)
    );
  };

  /**
   * Handles the click event on the field drop-down menu
   * @param {string} filterId - State FieldID to modify
   * @param {Object} field - The field object being clicked
   */
  const handleFilterFieldMenuClick = (filterId, field) => {
    // If the filter exists
    if (filterId in filterParameters) {
      // Clone state
      const filtersNewState = { ...filterParameters };

      // Find the field we need to gather options from
      const fieldDetails = filtersConfig.fields.find(
        (filter) => filter.name === field
      );

      if (!fieldDetails) {
        filtersNewState[filterId] = generateEmptyField(filterId);
      } else {
        // Update field & type
        filtersNewState[filterId].field = fieldDetails.name;
        filtersNewState[filterId].type = fieldDetails.type;
        filtersNewState[filterId].placeholder = fieldDetails.placeholder;
        filtersNewState[filterId].label = fieldDetails.label;

        // Update Available Operators
        if (
          fieldDetails.operators.length === 1 &&
          fieldDetails.operators[0] === "*"
        ) {
          // Add all operators and filter by specific type (defined in fieldDetails.type)
          filtersNewState[filterId].availableOperators = Object.keys(
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
          filtersNewState[filterId].availableOperators =
            fieldDetails.operators.map((operator) => {
              return {
                ...filtersConfig.operators[operator],
                ...{ id: operator },
              };
            });
        }

        // if the field has a corresponding lookup table, add to filterState
        if (fieldDetails.lookup) {
          filtersNewState[filterId].lookup_table =
            fieldDetails.lookup.table_name;
          filtersNewState[filterId].lookup_field =
            fieldDetails.lookup.field_name;
        }
        // if it does not, reset the variables to null in case the user is editing an existing filter
        else {
          filtersNewState[filterId].lookup_table = null;
          filtersNewState[filterId].lookup_field = null;
        }
      }

      // Select the default operator, if not defined select first.
      if (fieldDetails) {
        const defaultOperator = getDefaultOperator(fieldDetails);
        handleFilterOperatorClick(filterId, defaultOperator);
      }
      // Update the state
      setFilterParameters(filtersNewState);
    } else {
      console.debug(
        `The filter id ${filterId} does not exist, ignoring click event.`
      );
    }
  };

  /**
   * Handles the click event on the operator drop-down
   * @param {string} filterId - State FieldID to modify
   * @param {Object} operator - The operator object being clicked
   */
  const handleFilterOperatorClick = (filterId, operator) => {
    // If the filter exists
    if (filterId in filterParameters) {
      // Clone state
      const filtersNewState = { ...filterParameters };

      if (operator in filtersConfig.operators) {
        // Update Operator Value
        filtersNewState[filterId].operator = operator;
        // Get the GraphQL operator details
        filtersNewState[filterId].gqlOperator =
          filtersConfig.operators[operator].operator;
        // Copy the envelope if available
        filtersNewState[filterId].envelope =
          filtersConfig.operators[operator].envelope;
        // Copy special null value if available
        filtersNewState[filterId].specialNullValue =
          filtersConfig.operators[operator].specialNullValue;

        // if we are switching to an autocomplete input, clear the search value
        if (renderAutocompleteInput(filtersNewState[filterId])) {
          filtersNewState[filterId].value = null;
        }
      } else {
        // Reset operator values
        filtersNewState[filterId].operator = null;
        filtersNewState[filterId].gqlOperator = null;
        filtersNewState[filterId].envelope = null;
      }

      setFilterParameters(filtersNewState);
    } else {
      console.debug(
        `The filter id ${filterId} does not exist, ignoring click event.`
      );
    }
  };

  /**
   * Adds an empty filter to the state
   */
  const handleAddFilterButtonClick = () => {
    generateEmptyFilter();
  };

  /**
   * Deletes a filter from the state
   * @param {string} filterId - The UUID of the filter to be deleted
   */
  const handleDeleteFilterButtonClick = (filterId) => {
    // Copy the state into a new object
    const filtersNewState = {
      ...filterParameters,
    };
    // Try to delete the filter by filterId
    try {
      // Delete the key (if it's there)
      delete filtersNewState[filterId];
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
   * @param {string} filterId - The FilterID uuid
   * @param {string} value - The value to assign to that filter
   */
  const handleSearchValueChange = (filterId, value) => {
    // Clone the state
    const filtersNewState = { ...filterParameters };
    // Patch the new state
    filtersNewState[filterId].value = value;
    // Update the state
    setFilterParameters(filtersNewState);
  };

  /**
   * Clears the filters
   */
  const handleClearFilters = useCallback(() => {
    setFilterParameters({});
    setFilters({});
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
      if (Object.keys(filterParameters).length === 0) {
        feedback.push("• No filters have been added.");
      } else {
        Object.keys(filterParameters).forEach((filterKey) => {
          const { field, value, gqlOperator } = filterParameters[filterKey];
          if (field === null) {
            feedback.push("• One or more fields have not been selected.");
          }

          if (gqlOperator === null) {
            feedback.push("• One or more operators have not been selected.");
          }

          if (value === null || value === "") {
            if (gqlOperator && !gqlOperator.includes("is_null")) {
              feedback.push("• One or more missing values.");
            }
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
   * It returns true if the operator is null
   * @param {object} field - The field being checked
   * @returns {boolean}
   */
  const isFilterNullType = (field) => {
    return field.gqlOperator && field.gqlOperator.includes("is_null");
  };

  /**
   * This side effect monitors the count of filters
   * if the count of filters is zero, then resets the state
   */
  useEffect(() => {
    if (Object.keys(filterParameters).length === 0) {
      setFilters([]);
      handleClearFilters();
      // Add an empty filter so the user doesn't have to click the 'add filter' button
      generateEmptyFilter();
    }
  }, [filterParameters, setFilters, generateEmptyFilter, handleClearFilters]);

  /**
   * This side effect monitors whether the user has added a complete filter
   */
  useEffect(() => {
    Object.keys(filterParameters).forEach((filterKey) => {
      if (
        !!filterParameters[filterKey].value ||
        OPERATORS_WITHOUT_SEARCH_VALUES.includes(
          filterParameters[filterKey].operator
        )
      ) {
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

      {Object.keys(filterParameters).map((filterId) => {
        return (
          <Grow in={true} key={`filter-grow-${filterId}`}>
            <Grid
              container
              id={`filter-${filterId}`}
              key={`filter-${filterId}`}
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
                    value={filterParameters[filterId].label || null}
                    id={`filter-field-select-${filterId}`}
                    options={filtersConfig.fields}
                    getOptionLabel={(f) =>
                      Object.hasOwn(f, "label") ? f.label : f
                    }
                    onChange={(e, value) => {
                      handleFilterFieldMenuClick(filterId, value?.name);
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
                  <InputLabel id={`filter-operator-select-${filterId}-label`}>
                    Operator
                  </InputLabel>
                  <Select
                    variant="standard"
                    fullWidth
                    disabled={
                      filterParameters[filterId].availableOperators.length === 0
                    }
                    labelId={`filter-operator-select-${filterId}-label`}
                    id={`filter-operator-select-${filterId}`}
                    value={
                      filterParameters[filterId].operator
                        ? filterParameters[filterId].operator
                        : ""
                    }
                    onChange={(e) =>
                      handleFilterOperatorClick(filterId, e.target.value)
                    }
                    label="field"
                    data-testid="operator-select"
                  >
                    {filterParameters[filterId].availableOperators.map(
                      (operator, operatorIndex) => {
                        return (
                          <MenuItem
                            value={operator.id}
                            key={`filter-operator-select-item-${filterId}-${operatorIndex}`}
                            id={`filter-operator-select-item-${filterId}-${operatorIndex}`}
                            data-testid={operator.label}
                          >
                            {operator.label}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} className={classes.gridItemPadding}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
                  {isFilterNullType(filterParameters[filterId]) !== true &&
                    (renderAutocompleteInput(filterParameters[filterId]) ? (
                      <Autocomplete
                        value={filterParameters[filterId].value || null}
                        options={data[filterParameters[filterId].lookup_table]}
                        disabled={!filterParameters[filterId].operator}
                        getOptionLabel={(option) =>
                          Object.hasOwn(
                            option,
                            filterParameters[filterId].lookup_field
                          )
                            ? option[filterParameters[filterId].lookup_field]
                            : option
                        }
                        onChange={(e, value) => {
                          if (value) {
                            handleSearchValueChange(
                              filterId,
                              value[filterParameters[filterId]?.lookup_field]
                            );
                          } else {
                            // value is null when the Autocomplete selection is cleared
                            handleSearchValueChange(filterId, value);
                          }
                        }}
                        isOptionEqualToValue={(option, value) => {
                          if (Object.hasOwn(value, "name")) {
                            return option.name === value.name;
                          }
                          return (
                            option[filterParameters[filterId].lookup_field] ===
                            value
                          );
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
                        key={`filter-search-value-${filterId}`}
                        id={`filter-search-value-${filterId}`}
                        disabled={!filterParameters[filterId].operator}
                        type={
                          filterParameters[filterId].type
                            ? filterParameters[filterId].type
                            : "text"
                        }
                        onChange={(e) =>
                          handleSearchValueChange(filterId, e.target.value)
                        }
                        variant="outlined"
                        value={filterParameters[filterId].value ?? ""}
                      />
                    ))}
                </FormControl>
              </Grid>
              <Hidden mdDown>
                <Grid item xs={12} md={1} style={{ textAlign: "center" }}>
                  <IconButton
                    disabled={isFirstFilterIncomplete}
                    className={classes.deleteButton}
                    onClick={() => handleDeleteFilterButtonClick(filterId)}
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
                    onClick={() => handleDeleteFilterButtonClick(filterId)}
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
          <Grow in={handleApplyValidation() === null}>
            <Button
              fullWidth
              className={classes.applyButton}
              variant="contained"
              color="primary"
              startIcon={<Icon>search</Icon>}
              onClick={handleApplyButtonClick}
            >
              Search
            </Button>
          </Grow>
        </Grid>
      </Grid>
    </Grid>
  );
};

Filters.propTypes = {
  className: PropTypes.string,
};

export default Filters;
