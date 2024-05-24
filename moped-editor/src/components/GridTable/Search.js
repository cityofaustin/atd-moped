import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { Box, Button, Grid, Paper, Popper } from "@mui/material";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import Filters from "src/components/GridTable/Filters";
import SearchBar from "./SearchBar";
import makeStyles from "@mui/styles/makeStyles";
import { simpleSearchParamName } from "src/views/projects/projectsListView/useProjectListViewQuery/useSearch";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  downloadButtonGrid: {
    padding: "12px",
  },
  downloadCsvButton: {
    height: "43px",
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

  return (
    <div>
      <Box mt={3}>
        <Paper ref={divRef}>
          <Grid container className={classes.searchBarContainer}>
            <Grid
              item
              xs={12}
              sm={8}
              lg={10}
              className={classes.gridSearchPadding}
            >
              <SearchBar
                searchFieldValue={searchFieldValue}
                setSearchFieldValue={setSearchFieldValue}
                filters={filters}
                toggleAdvancedSearch={toggleAdvancedSearch}
                advancedSearchAnchor={advancedSearchAnchor}
                setSearchTerm={setSearchTerm}
                queryConfig={queryConfig}
                isOr={isOr}
                loading={loading}
                filtersConfig={filtersConfig}
                resetSimpleSearch={resetSimpleSearch}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              md={4}
              lg={2}
              className={classes.downloadButtonGrid}
            >
              {queryConfig.showExport && (
                <Button
                  disabled={
                    (parentData?.[queryConfig.table] ?? []).length === 0
                  }
                  className={classes.downloadCsvButton}
                  onClick={handleExportButtonClick}
                  startIcon={<SaveAltIcon />}
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  Download
                </Button>
              )}
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
