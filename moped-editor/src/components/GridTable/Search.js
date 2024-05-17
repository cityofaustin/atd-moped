import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { Box, Button, Grid, Paper, Popper } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Hidden from "@mui/material/Hidden";
import Icon from "@mui/material/Icon";
import Switch from "@mui/material/Switch";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Filters from "src/components/GridTable/Filters";
import SearchBar from "./SearchBar";
import makeStyles from "@mui/styles/makeStyles";
import { simpleSearchParamName } from "src/views/projects/projectsListView/useProjectListViewQuery/useSearch";
import theme from "src/theme";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  downloadButtonGrid: {
    // match the existing padding set in gridSearchPadding
    padding: "12px",
    [theme.breakpoints.down("md")]: {
      paddingTop: 0,
    },
    alignContent: "top",
  },
  tabStyle: {
    margin: ".5rem",
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
    zIndex: "3",
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
}) => {
  const classes = useStyles();
  const divRef = React.useRef();

  let [, setSearchParams] = useSearchParams();

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
    // Stop if we don't have any value entered in the search field
    if (searchFieldValue.length === 0) {
      return;
    }

    // Prevent default behavior on any event
    if (event) event.preventDefault();

    // Update state to trigger search and set simple search param
    setSearchTerm(searchFieldValue);
    setSearchParams((prevSearchParams) => {
      prevSearchParams.set(simpleSearchParamName, searchFieldValue);

      return prevSearchParams;
    });
  };

  return (
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
                toggleAdvancedSearch={toggleAdvancedSearch}
                advancedSearchAnchor={advancedSearchAnchor}
                queryConfig={queryConfig}
                isOr={isOr}
                loading={loading}
                filtersConfig={filtersConfig}
                resetSimpleSearch={resetSimpleSearch}
              />
            </Grid>
            <Grid item xs={12} md="auto" className={classes.downloadButtonGrid}>
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
                            onChange={() => setShowMapView(!showMapView)}
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
            filters={filters}
            setFilters={setFilters}
            handleAdvancedSearchClose={handleAdvancedSearchClose}
            filtersConfig={filtersConfig}
            resetSimpleSearch={resetSimpleSearch}
            isOr={isOr}
            setIsOr={setIsOr}
          />
        </Paper>
      </Popper>
    </div>
  );
};

Search.propTypes = {
  className: PropTypes.string,
};

export default Search;
