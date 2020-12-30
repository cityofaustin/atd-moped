import React from "react";
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
  SvgIcon,
  Icon,
  makeStyles,
} from "@material-ui/core";
import { Search as SearchIcon } from "react-feather";

/**
 * The styling for the filter components
 * @type {Object}
 * @constant
 */
const useStyles = makeStyles(theme => ({
  root: {},
  searchBox: {
    marginTop: theme.spacing(6),
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
   * An alias of the state, to make it easy to access.
   * @type {Object}
   * @constant
   */
  const filters = filterState.filterParameters;

  /**
   * Handles the click event on the filter drop-down menu
   * @param {string} filterId - State FieldID to modify
   * @param {Object} field - The field object being clicked
   */
  const handleFilterFieldMenuClick = (filterId, field) => {
    console.debug(`handleFilterFieldMenuClick: ${filterId} - ${field}`);

    // If the filter exists
    if (filterId in filterState.filterParameters) {
      // Clone state
      const filtersNewState = { ...filterState.filterParameters };



      // Find the field we need to gather options from
      const fieldIndex = query.config.filters.fields.findIndex(
        filter => filter.name === field
      );

      // Gather field details
      const fieldDetails = query.config.filters.fields[fieldIndex];

      // Update field & type
      filtersNewState[filterId].field = fieldDetails.name;
      filtersNewState[filterId].type = fieldDetails.type;

      // Update Available Operators
      if (
        fieldDetails.operators.length === 1 &&
        fieldDetails.operators[0] === "*"
      ) {
        // Add all operators and filter by specific type (defined in fieldDetails.type)
        filtersNewState[
          filterId
        ].availableOperators = Object.keys(query.config.filters.operators).filter(
          operator => query.config.filters.operators[operator].type === fieldDetails.type
        );
      } else {
        // Append listed operators for that field
        filtersNewState[
          filterId
        ].availableOperators = fieldDetails.operators.map(
          operator => query.config.filters.operators[operator]
        );
      }

      filterState.setFilterParameters(filtersNewState);
    } else {
      console.debug(
        `The filter id ${filterId} does not exist, ignoring click event.`
      );
    }

    // Ignore the click?
  };

  /**
   * Handles the click event on the operator drop-down
   * @param {string} filterId - State FieldID to modify
   * @param {Object} operator - The operator object being clicked
   */
  const handleFilterOperatorClick = (filterId, operator) => {
    console.debug(`handleFilterOperatorClick: ${filterId} - ${operator}`);
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
   * Adds an empty filter to the state
   */
  const handleAddFilterButtonClick = () => {
    const uuid = generateUuid();
    console.log("UUID being added to state", uuid);
    const filtersNewState = {
      ...filterState.filterParameters,
    };

    filtersNewState[uuid] = {
      id: uuid,
      field: null,
      operator: null,
      availableOperators: [],
      value: null,
      type: null,
    };

    filterState.setFilterParameters(filtersNewState);
  };

  /**
   * Deletes a filter from the state
   * @param {string} filterId - The UUID of the filter to be deleted
   */
  const handleDeleteFilterButtonClick = filterId => {
    // Copy the state into a new object
    const filtersNewState = {
      ...filterState.filterParameters,
    };

    try {
      // Delete the key (if it's there)
      delete filtersNewState[filterId];
    } finally {
      // Finally, reset the state
      filterState.setFilterParameters(filtersNewState);
    }
  };

  console.debug("Filter state: ", filterState.filterParameters);

  return (
    <Grid>
      {Object.keys(filterState.filterParameters).map(
        (filterId, filterIndex) => {
          console.log("Rendering filter: " + filterId + " @ " + filterIndex);
          return (
            <Grid container spacing={3}>
              {/*Select Field to search from drop-down menu*/}
              <Grid item xs={4}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
                  <InputLabel
                    id={"filter-field-label" + filterIndex}
                    key={"filter-field-label" + filterIndex}
                  >
                    Field
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId={"filter-field-label" + filterIndex}
                    id={"filter-field-select" + filterId}
                    value={filters[filterId].field}
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
                          key={`filter-menuitem-${field.name}-${fieldIndex}`}
                        >
                          {field.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {/*Select the operator from drop-down menu*/}
              <Grid item xs={3}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Operator
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={filters[filterId].operator}
                    onChange={e =>
                      handleFilterOperatorClick(filterId, e.target.value)
                    }
                    label="field"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {filters[filterId].availableOperators.map((operator, operatorIndex) => {
                      return (
                        <MenuItem value={operator.name}>
                          {operator.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className={classes.formControl}
                >
                  <TextField
                    onChange={null}
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
                  />
                </FormControl>
              </Grid>
              <Grid item xs={1}>
                <Button
                  className={classes.filterButton}
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  startIcon={<Icon>delete_outline</Icon>}
                  onClick={() => handleDeleteFilterButtonClick(filterId)}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          );
        }
      )}
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Button
            className={classes.bottomButton}
            fullWidth
            variant="contained"
            color="default"
            startIcon={<Icon>playlist_add</Icon>}
            onClick={handleAddFilterButtonClick}
          >
            Add Filter
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            className={classes.bottomButton}
            fullWidth
            variant="contained"
            color="default"
            startIcon={<Icon>delete_forever</Icon>}
          >
            Reset
          </Button>
        </Grid>
        <Grid item xs={6}>
          {" "}
        </Grid>
      </Grid>
    </Grid>
  );
};

GridTableFilters.propTypes = {
  className: PropTypes.string,
};

export default GridTableFilters;
