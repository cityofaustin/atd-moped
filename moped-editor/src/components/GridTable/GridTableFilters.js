import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

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

import makeStyles from '@mui/styles/makeStyles';

import { Alert } from '@mui/material';
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";

/**
 * The styling for the filter components
 * @type {Object}
 * @constant
 */
const useStyles = makeStyles(theme => ({
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
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
    },
  },
  bottomButton: {
    margin: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
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
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
    },
  },
}));

/**
 * Filter Search Component aka Advanced Search
 * @param {Object} query - The main query object
 * @param {Object} filterState - The current state/state-modifier bundle for filters
 * @return {JSX.Element}
 * @constructor
 */
const GridTableFilters = ({
  query,
  filterState,
  filterQuery,
  history,
  handleAdvancedSearchClose,
}) => {
  /**
   * The styling of the search bar
   * @constant
   * @default
   */
  const classes = useStyles();
  const queryPath = useLocation().pathname;

  /**
   * The current local filter parameters
   * @type {Object} filterParameters - Contains all the current filters
   * @function setFilterParameters - Update the state of filterParameters
   * @default {filterState.filterParameters}
   */
  const [filterParameters, setFilterParameters] = useState(
    filterState.filterParameters
  );

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

  /**
   * Generates a copy of an empty field
   * @param uuid
   * @return {Object}
   */
  const generateEmptyField = uuid => {
    return { ...defaultNewFieldState, id: uuid };
  };

  /**
   * Generates a random UUID as a string
   * @return {string}
   */
  const generateUuid = () => {
    let dt = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
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
      const fieldIndex = query.config.filters.fields.findIndex(
        filter => filter.name === field
      );

      // Gather field details
      const fieldDetails = query.config.filters.fields[fieldIndex];

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
            query.config.filters.operators
          )
            .filter(
              operator =>
                query.config.filters.operators[operator].type ===
                fieldDetails.type
            )
            .map(operator => {
              return {
                ...query.config.filters.operators[operator],
                ...{ id: operator },
              };
            });
        } else {
          // Append listed operators for that field
          filtersNewState[
            filterId
          ].availableOperators = fieldDetails.operators.map(operator => {
            return {
              ...query.config.filters.operators[operator],
              ...{ id: operator },
            };
          });
        }
      }

      // Select the default operator, if not defined select first.
      if (fieldDetails)
        handleFilterOperatorClick(
          filterId,
          fieldDetails.defaultOperator
            ? fieldDetails.defaultOperator
            : filtersNewState[filterId].availableOperators[0].id
        );

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

      if (operator in query.config.filters.operators) {
        // Update Operator Value
        filtersNewState[filterId].operator = operator;
        // Get the GraphQL operator details
        filtersNewState[filterId].gqlOperator =
          query.config.filters.operators[operator].operator;
        // Copy the envelope if available
        filtersNewState[filterId].envelope =
          query.config.filters.operators[operator].envelope;
        // Copy special null value if available
        filtersNewState[filterId].specialNullValue =
          query.config.filters.operators[operator].specialNullValue;
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
    // Generate a random UUID string
    const uuid = generateUuid();
    // Clone state
    const filtersNewState = {
      ...filterParameters,
    };
    // Patch new state
    filtersNewState[uuid] = generateEmptyField(uuid);
    // Update new state
    setFilterParameters(filtersNewState);
  };

  /**
   * Deletes a filter from the state
   * @param {string} filterId - The UUID of the filter to be deleted
   */
  const handleDeleteFilterButtonClick = filterId => {
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
      filterQuery.set("filter", btoa(JSON.stringify(filtersNewState)));
      history.push(`${queryPath}?filter=${filterQuery.get("filter")}`);
      setFilterParameters(filtersNewState);
    }
  };

  /**
   * The user will type a new search value, wait 1/3rd of a second to update state.
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
  const handleClearFilters = () => {
    setFilterParameters({});
    filterState.setFilterParameters({});
  };

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
        Object.keys(filterParameters).forEach(filterKey => {
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
    filterQuery.set("filter", btoa(JSON.stringify(filterParameters)));
    history.push(`${queryPath}?filter=${filterQuery.get("filter")}`);
    filterState.setFilterParameters(filterParameters);
    handleAdvancedSearchClose();
  };

  /**
   * It returns true if the operator is null
   * @param {object} field - The field being checked
   * @returns {boolean}
   */
  const isFilterNullType = field => {
    return field.gqlOperator && field.gqlOperator.includes("is_null");
  };

  /**
   * This side effect monitors the count of filters
   * if the count of filters is zero, then resets the state
   */
  useEffect(() => {
    if (Object.keys(filterParameters).length === 0) {
      filterState.setFilterParameters(filterParameters);
    }
  }, [filterParameters, filterState]);

  return (
    <Grid>
      <Grid container justifyContent={"flex-end"}>
        <IconButton
          onClick={handleAdvancedSearchClose}
          className={classes.closeButton}
          size="large">
          <Icon fontSize={"small"}>close</Icon>
        </IconButton>
      </Grid>
      {Object.keys(filterParameters).length === 0 && (
        <Alert className={classes.filterAlert} severity="info">
          You don't have any search filters, add one below.
        </Alert>
      )}
      {Object.keys(filterParameters).map(filterId => {
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
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel
                    id={`filter-field-select-${filterId}-label`}
                    key={`filter-field-select-${filterId}-label`}
                  >
                    Field
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId={`filter-field-select-${filterId}`}
                    id={`filter-field-select-${filterId}`}
                    value={
                      filterParameters[filterId].field
                        ? filterParameters[filterId].field
                        : ""
                    }
                    onChange={e =>
                      handleFilterFieldMenuClick(filterId, e.target.value)
                    }
                    label="field"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {query.config.filters.fields.map((field, fieldIndex) => {
                      return (
                        <MenuItem
                          value={field.name}
                          key={`filter-field-select-item-${field.name}-${fieldIndex}`}
                          id={`filter-field-select-item-${field.name}-${fieldIndex}`}
                        >
                          {field.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>

              {/*Select the operator from drop-down menu*/}
              <Grid item xs={12} md={3} className={classes.gridItemPadding}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel id={`filter-operator-select-${filterId}-label`}>
                    Operator
                  </InputLabel>
                  <Select
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
                    onChange={e =>
                      handleFilterOperatorClick(filterId, e.target.value)
                    }
                    label="field"
                  >
                    {filterParameters[filterId].availableOperators.map(
                      (operator, operatorIndex) => {
                        return (
                          <MenuItem
                            value={operator.id}
                            key={`filter-operator-select-item-${filterId}-${operatorIndex}`}
                            id={`filter-operator-select-item-${filterId}-${operatorIndex}`}
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
                  {isFilterNullType(filterParameters[filterId]) !== true && (
                    <TextField
                      key={`filter-search-value-${filterId}`}
                      id={`filter-search-value-${filterId}`}
                      type={
                        filterParameters[filterId].type
                          ? filterParameters[filterId].type
                          : "text"
                      }
                      onChange={e =>
                        handleSearchValueChange(filterId, e.target.value)
                      }
                      variant="outlined"
                      value={filterParameters[filterId].value}
                    />
                  )}
                </FormControl>
              </Grid>
              <Hidden mdDown>
                <Grid item xs={12} md={1} style={{ textAlign: "center" }}>
                  <IconButton
                    className={classes.deleteButton}
                    onClick={() => handleDeleteFilterButtonClick(filterId)}
                    size="large">
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
          {Object.keys(filterParameters).length > 0 && (
            <Button
              className={classes.bottomButton}
              fullWidth
              variant="outlined"
              startIcon={<BackspaceOutlinedIcon />}
              onClick={handleClearFilters}
            >
              Reset
            </Button>
          )}
        </Grid>
        <Hidden mdDown>
          <Grid item xs={12} md={7}>
            {""}
          </Grid>
        </Hidden>
        <Grid item xs={12} md={2}>
          {Object.keys(filterParameters).length > 0 && (
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
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

GridTableFilters.propTypes = {
  className: PropTypes.string,
};

export default GridTableFilters;
