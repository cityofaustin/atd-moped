import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Paper,
  Popper,
  ClickAwayListener,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Hidden from "@mui/material/Hidden";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Filters from "src/components/GridTable/Filters";
import SearchBar from "src/components/GridTable/SearchBar";
import makeStyles from "@mui/styles/makeStyles";
import { simpleSearchParamName } from "src/views/projects/projectsListView/useProjectListViewQuery/useSearch";
import { mapSearchParamName } from "src/views/projects/projectsListView/ProjectsListViewTable";
import theme from "src/theme";

const useStyles = makeStyles((theme) => ({
  downloadButtonGrid: {
    // match the existing padding set in gridSearchPadding
    padding: "12px",
    [theme.breakpoints.down("md")]: {
      paddingTop: 0,
    },
    alignContent: "top",
  },
  searchBarContainer: {
    padding: "2px",
    [theme.breakpoints.down("sm")]: {
      paddingBottom: "12px",
    },
  },
  advancedSearchRoot: {
    width: `calc(100% - ${theme.spacing(6)})`,
    [theme.breakpoints.down("sm")]: {
      width: `calc(100% - ${theme.spacing(4)})`,
    },
    // zIndex must be higher than the MUI Drawer used in MapDrawer
    zIndex: "1201",
  },
  advancedSearchPaper: {
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    boxShadow:
      "rgb(0 0 0 / 31%) 0px 0px 1px 0px, rgb(0 0 0 / 25%) 0px 3px 4px -2px",
  },
  gridSearchPadding: {
    padding: "12px",
  },
}));

/**
 * Renders a table search component with a search bar and search filters
 * @param {Object} filters - The current filters from useAdvancedSearch hook
 * @param {Function} setFilters - Set the current filters from useAdvancedSearch hook
 * @param {Object} parentData - Response data (if any) from the parent component
 * @param {Object} advancedSearchAnchor - The anchor element for the advanced search popper
 * @param {Function} setAdvancedSearchAnchor - Set the anchor element for the advanced search popper
 * @param {String} searchTerm - The current search term from useSearch hook
 * @param {Function} setSearchTerm - Set the current search term from useSearch hook
 * @param {Object} queryConfig - The query configuration for the current table
 * @param {Object} filtersConfig - The filters configuration for the current table
 * @param {Function} handleExportButtonClick - The function to handle the export button click
 * @return {JSX.Element}
 * @constructor
 */
const Search = ({
  filters,
  setFilters,
  parentData = null,
  advancedSearchAnchor,
  setAdvancedSearchAnchor,
  searchTerm,
  setSearchTerm,
  queryConfig,
  filtersConfig,
  handleExportButtonClick,
  isOr,
  setIsOr,
  loading,
  showMapView,
  setShowMapView,
  handleSnackbar,
}) => {
  const classes = useStyles();
  const divRef = React.useRef();

  let [searchParams, setSearchParams] = useSearchParams();

  /**
   * The contents of the search box in SearchBar
   * @type {string} searchFieldValue
   * @function setSearchFieldValue - Sets the state of the field
   */
  const [searchFieldValue, setSearchFieldValue] = useState(searchTerm);

  const toggleAdvancedSearch = () => {
    if (advancedSearchAnchor) {
      setAdvancedSearchAnchor(null);
    } else {
      setAdvancedSearchAnchor(divRef.current);
    }
  };

  const handleAdvancedSearchClose = () => {
    setAdvancedSearchAnchor(null);
  };

  const resetSimpleSearch = () => {
    setSearchFieldValue("");
    setSearchTerm("");

    setSearchParams((prevSearchParams) => {
      prevSearchParams.delete(simpleSearchParamName);
      return prevSearchParams;
    });
  };

  /**
   * Handles the submission of our search form
   * @param {Object} e - The event object
   */
  const handleSearchSubmission = (event) => {
    const trimmedSearchFieldValue = searchFieldValue?.trim();

    // Stop if we don't have any value entered in the search field
    if (trimmedSearchFieldValue.length === 0) {
      // If the user only entered whitespace, clear the search input
      if (searchFieldValue.length > 0) {
        resetSimpleSearch();
      }
      return;
    }

    // Prevent default behavior on any event
    if (event) event.preventDefault();

    // Update the search field and search term with the trimmed value
    setSearchFieldValue(trimmedSearchFieldValue);
    setSearchTerm(trimmedSearchFieldValue);
    setSearchParams((prevSearchParams) => {
      prevSearchParams.set(simpleSearchParamName, trimmedSearchFieldValue);

      return prevSearchParams;
    });
  };

  const handleMapToggle = () => {
    setShowMapView(!showMapView);
    setSearchParams((prevSearchParams) => {
      prevSearchParams.set(mapSearchParamName, !showMapView);

      return prevSearchParams;
    });
  };

  return (
    <ClickAwayListener onClickAway={handleAdvancedSearchClose}>
      {/* FYI: you cannot use a Select component inside the click away listener
        as discussed in this thread https://github.com/mui/material-ui/issues/25578 
        so we have opted to use Autocompletes instead*/}
      <div>
        <Box mt={3}>
          <Paper ref={divRef}>
            <Grid container className={classes.searchBarContainer}>
              <Grid item xs={12} md className={classes.gridSearchPadding}>
                <SearchBar
                  searchFieldValue={searchFieldValue}
                  setSearchFieldValue={setSearchFieldValue}
                  handleSearchSubmission={handleSearchSubmission}
                  filters={filters}
                  setFilters={setFilters}
                  toggleAdvancedSearch={toggleAdvancedSearch}
                  advancedSearchAnchor={advancedSearchAnchor}
                  queryConfig={queryConfig}
                  isOr={isOr}
                  loading={loading}
                  filtersConfig={filtersConfig}
                  resetSimpleSearch={resetSimpleSearch}
                  setIsOr={setIsOr}
                  searchTerm={searchTerm}
                  setSearchParams={setSearchParams}
                  handleSnackbar={handleSnackbar}
                />
              </Grid>
              <Grid
                item
                xs={12}
                md="auto"
                className={classes.downloadButtonGrid}
              >
                <div>
                  {queryConfig.showExport && (
                    <>
                      <Hidden smUp>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Icon>search</Icon>}
                          onClick={handleSearchSubmission}
                          sx={{ marginRight: theme.spacing(2) }}
                        >
                          Search
                        </Button>
                      </Hidden>
                      <FormGroup sx={{ display: "inline" }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={showMapView}
                              onChange={handleMapToggle}
                            />
                          }
                          label="Map"
                        />
                      </FormGroup>
                      <Button
                        disabled={
                          (parentData?.[queryConfig.table] ?? []).length === 0
                        }
                        onClick={handleExportButtonClick}
                        sx={{
                          // Override startIcon margins to center icon when there is no "Download" text smDown
                          "& .MuiButton-startIcon": {
                            marginLeft: { xs: 0, sm: -theme.spacing(0.5) },
                            marginRight: { xs: 0, sm: theme.spacing(1) },
                          },
                        }}
                        startIcon={<SaveAltIcon />}
                        variant="outlined"
                        color="primary"
                      >
                        <Hidden smDown>Download</Hidden>
                      </Button>
                    </>
                  )}
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <Popper
          id="advancedSearch"
          open={Boolean(advancedSearchAnchor)}
          anchorEl={advancedSearchAnchor}
          onClose={handleAdvancedSearchClose}
          placement={"bottom"}
          className={classes.advancedSearchRoot}
        >
          <Paper className={classes.advancedSearchPaper}>
            <Filters
              setFilters={setFilters}
              handleAdvancedSearchClose={handleAdvancedSearchClose}
              filtersConfig={filtersConfig}
              resetSimpleSearch={resetSimpleSearch}
              isOr={isOr}
              setIsOr={setIsOr}
              setSearchParams={setSearchParams}
              searchParams={searchParams}
              searchFieldValue={searchFieldValue}
              setSearchFieldValue={setSearchFieldValue}
              setSearchTerm={setSearchTerm}
            />
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

Search.propTypes = {
  className: PropTypes.string,
};

export default Search;
