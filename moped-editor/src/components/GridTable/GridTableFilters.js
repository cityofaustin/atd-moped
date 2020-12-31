import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  TextField,
  InputLabel,
  Select,
  InputAdornment,
  FormControl,
  MenuItem,
  Grid,
  Icon,
  Grow,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";

import { Alert } from "@material-ui/lab";

/**
 * The styling for the filter components
 * @type {Object}
 * @constant
 */
const useStyles = makeStyles(theme => ({
  root: {},
  filterAlert: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(0),
  },
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
  bottomButton: {
    margin: theme.spacing(1),
  },
  applyButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  buttonDark: {
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

/**
 * Filter Search Component
 * @param {Object} query - The main query object
 * @param {Object} filterState - The current state/state-modifier bundle for filters
 * @return {JSX.Element}
 * @constructor
 */
const GridTableFilters = ({ query, filterState }) => {
  /**
   * The styling of the search bar
   * @constant
   * @default
   */
  const classes = useStyles();

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
   * The current local filter parameters
   * @type {boolean} confirmDialogOpen - Contains all the current filters
   * @function setConfirmDialogOpen - Update the state of filterParameters
   * @default false
   */
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  /**
   * This is a timer allocation that will update the state after the user is finished typing.
   * @type {integer} - The returned timeoutID is a positive integer value which identifies the timer created by the call to setTimeout()
   * @default null
   */
  let typingTimer = null;

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
   * Returns the icon we want to show in the search field value
   * @param {string} type - The field's type as a string
   * @return {string}
   */
  const getIconForType = type => {
    const typeIconMap = {
      string: "font_download",
      number: "looks_one",
      date: "event",
      default: "info",
    };

    return type in typeIconMap ? typeIconMap[type] : typeIconMap["default"];
  };

  /**
   * Handles the click event on the filter drop-down menu
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
    // Clear the current timer
    clearTimeout(typingTimer);
    // Start a new timer with a 1/3rd of a second delay.
    typingTimer = setTimeout(() => {
      // Update the state
      setFilterParameters(filtersNewState);
    }, 333);
  };

  /**
   * Clears all the current filters
   */
  const handleResetFiltersButtonClick = () => {
    if (Object.keys(filterParameters).length > 0) setConfirmDialogOpen(true);
  };

  /**
   * Closes the dialog
   */
  const handleDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  /**
   * Clears the filters, closes the dialog
   */
  const handleClearFilters = () => {
    handleDialogClose();
    setFilterParameters({});
    filterState.setFilterParameters({});
  };

  /**
   * Applies the current local state and updates the parent's
   */
  const handleApplyButtonClick = () => {
    filterState.setFilterParameters(filterParameters);
  };

  return (
    <Grid>
      {Object.keys(filterParameters).length === 0 && (
        <Alert className={classes.filterAlert} severity="info">
          You don't have any search filters, add one below.
        </Alert>
      )}
      {Object.keys(filterParameters).map(filterId => {
        return (
          <Grow in={true}>
            <Grid
              container
              spacing={3}
              id={`filter-${filterId}`}
              key={`filter-${filterId}`}
            >
              {/*Select Field to search from drop-down menu*/}
              <Grid item xs={12} lg={4}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
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
              <Grid item xs={12} lg={3}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
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
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
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
              <Grid item xs={12} lg={4}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
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
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon fontSize="small" color="action">
                            {getIconForType(filterParameters[filterId].type)}
                          </Icon>
                        </InputAdornment>
                      ),
                    }}
                    placeholder={
                      filterParameters[filterId].placeholder
                        ? filterParameters[filterId].operator
                          ? filterParameters[filterId].placeholder
                          : "Select operator"
                        : "Select field"
                    }
                    variant="outlined"
                    disabled={
                      filterParameters[filterId].operator === null ||
                      filterParameters[filterId].operator === ""
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} lg={1}>
                <Button
                  fullWidth
                  className={classes.filterButton}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDeleteFilterButtonClick(filterId)}
                >
                  <Icon>delete_outline</Icon>
                </Button>
              </Grid>
            </Grid>
          </Grow>
        );
      })}
      <Grid container spacing={3} id={`filter-options`} key={`filter-options`}>
        <Grid item xs={12} lg={3}>
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
        <Grid item xs={12} lg={3}>
          <Button
            className={classes.bottomButton}
            fullWidth
            variant="outlined"
            color="secondary"
            startIcon={<Icon>backspace</Icon>}
            onClick={handleResetFiltersButtonClick}
          >
            Reset
          </Button>
        </Grid>
        <Grid item xs={12} lg={3}>
          {""}
        </Grid>
        <Grid item xs={12} lg={3}>
          <Button
            fullWidth
            className={classes.applyButton}
            variant="contained"
            color="primary"
            startIcon={<Icon>check</Icon>}
            onClick={handleApplyButtonClick}
          >
            Apply
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete all your filters?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will remove all your filters, continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClearFilters} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

GridTableFilters.propTypes = {
  className: PropTypes.string,
};

export default GridTableFilters;
