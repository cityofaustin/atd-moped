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

const GridTableFilters = ({
  query,
}) => {
  const classes = useStyles();

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
              onChange={null}
              label="field"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"project_name"}>Project Name</MenuItem>
              <MenuItem value={"project_description"}>Description</MenuItem>
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
              onChange={null}
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
            variant="contained"
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
