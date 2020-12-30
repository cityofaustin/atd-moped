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
   * Handles the click event on the filter drop-down menu
   * @param {Object} field - The field object being clicked
   */
  const handleFilterMenuClick = field => {
    console.debug("handleFilterMenuClick", field);
  };

  /**
   * Handles the click event on the operator drop-down
   * @param {Object} operator - The operator object being clicked
   */
  const handleFilterOperatorClick = operator => {
    console.debug(`handleFilterOperatorItemClick: ${operator}`);
  };

  console.debug("Filter state: ", filterState.filterParameters);

  return (
    <Grid>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <FormControl
            fullWidth
            variant="outlined"
            className={classes.formControl}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Field
            </InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={"project_name"}
              onChange={e => handleFilterMenuClick(e.target.value)}
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
              value={"project_name"}
              onChange={e => handleFilterOperatorClick(e.target.value)}
              label="field"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"project_name"}>Contains</MenuItem>
              <MenuItem value={"project_description"}>
                Does Not Contain
              </MenuItem>
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
          >
            Delete
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Button
            className={classes.bottomButton}
            fullWidth
            variant="contained"
            color="default"
            startIcon={<Icon>playlist_add</Icon>}
          >
            Add Field
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
