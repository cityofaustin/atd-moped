import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Button,
  Card,
  CardContent,
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

const GridTableSearch = ({
  query,
  clearFilters,
  searchParameters,
  setSearchParameters,
  resetPage,
  filters,
  toggleAdvancedFilters,
  children,
}) => {
  const classes = useStyles();

  return (
    <div>
      {children}
      <Box mt={3}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={6}>
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
              <Grid item xs={2}>
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
                    <MenuItem value={"project_description"}>
                      Description
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <Button
                  className={classes.filterButtonFilters}
                  fullWidth
                  variant="contained"
                  color="secondary"
                  startIcon={<Icon>rule</Icon>}
                >
                  Filters
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  className={classes.filterButton}
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<Icon>search</Icon>}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

GridTableSearch.propTypes = {
  className: PropTypes.string,
};

export default GridTableSearch;
