import React, { useState } from "react";
import {
  Box,
  ClickAwayListener,
  IconButton,
  InputBase,
  Popper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { GQLAbstract } from "atd-kickstand";
import { useLazyQuery } from "@apollo/client";
import { ProjectsListViewQueryConf } from "../../../views/projects/projectsListView/ProjectsListViewQueryConf";
import NavigationSearchResults from "./NavigationSearchResults.js";
import { getSearchValue } from "../../../components/GridTable/GridTable.js"

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    marginRight: "1em",
  },
  inputRoot: {
    borderWidth: "1px",
    borderRadius: "4px",
    borderColor: theme.palette.text.secondary,
    borderStyle: "solid",
    padding: "2px",
    width: "300px",
    height: "36px",
  },
  inputInput: {
    fontSize: "0.875rem",
    paddingLeft: "1em",
  },
  adornedStart: {
    color: theme.palette.text.secondary,
    paddingLeft: "5px",
  },
  searchPopper: {
    borderWidth: "1px",
    borderRadius: "4px",
    borderColor: "red", // theme.palette.text.secondary,
  },
  searchResults: {
    padding: "10px",
    backgroundColor: theme.palette.background.paper,
    borderWidth: "1px",
    borderRadius: "4px",
    borderColor: "#ff1345",
  },
}));

/**
 * @return {JSX.Element}
 * @constructor
 */
const NavigationSearchInput = () => {
  const classes = useStyles();
  const divRef = React.useRef();
  let projectSearchQuery = new GQLAbstract(ProjectsListViewQueryConf);

  // Toggle Text Input or magnifying glass
  const [searchInput, showSearchInput] = useState(false);
  // anchor element for results popper to "attach" to
  const [searchResultsAnchor, setSearchResultsAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [loadSearchResults, { called, loading, data }] = useLazyQuery(
    projectSearchQuery.gql,
    projectSearchQuery.config.options.useQuery
  );

  const handleMagClick = () => {
    showSearchInput(true);
  };

  const handleDropdownClose = () => {
    setSearchResultsAnchor(null);
    showSearchInput(false);
  };

  const handleSearchFocus = () => {
    setSearchResultsAnchor(divRef.current);
  };

  /**
   * Handles special keys typed in the search bar
   * @param {string} key - The key name being typed
   */
  const handleKeyDown = key => {
    switch (key) {
      // On Escape key, clear the search
      case "Escape":
        setSearchTerm("");
        setSearchResultsAnchor(null);
        break;
      // On Enter key, initialize the search
      case "Enter":
        handleSearchSubmission(null);
        break;

      default:
        return;
    }
  };

  const handleSearchSubmission = event => {
    // Stop if we don't have any value entered in the search field
    if (searchTerm.length === 0) {
      console.log("no search term");
    }

    // Prevent default behavior on any event
    if (event) event.preventDefault();

    // Update state if we are ready, triggers search.
    console.log(`searching ${searchTerm}`);
    Object.keys(projectSearchQuery.config.columns)
      .filter(column => projectSearchQuery.config.columns[column]?.searchable)
      .forEach(column => {
        const {
          operator,
          quoted,
          envelope,
        } = projectSearchQuery.config.columns[column].search;
        const searchValue = getSearchValue(projectSearchQuery, column, searchTerm);
        const graphqlSearchValue = quoted
          ? `"${envelope.replace("{VALUE}", searchValue)}"`
          : searchValue;

        projectSearchQuery.setOr(column, `${operator}: ${graphqlSearchValue}`);
      });
    loadSearchResults();
  };

  if (called && !loading) {
    console.log(data);
  } else {
    console.log(projectSearchQuery);
  }

  return (
    <div>
      <ClickAwayListener onClickAway={handleDropdownClose}>
        <div className={classes.root} ref={divRef}>
          {!searchInput ? (
            <IconButton onClick={handleMagClick}>
              <SearchIcon />
            </IconButton>
          ) : (
            <InputBase
              placeholder="Project name, description or eCAPRIS ID"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
                adornedStart: classes.adornedStart,
              }}
              inputProps={{ "aria-label": "search" }}
              startAdornment={<SearchIcon fontSize={"small"} />}
              onFocus={handleSearchFocus}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => handleKeyDown(e.key)}
              value={searchTerm}
              autoFocus
            />
          )}
          <Popper
            id="searchResults"
            open={Boolean(searchResultsAnchor)}
            anchorEl={searchResultsAnchor}
            onClose={handleDropdownClose}
            placement={"bottom-start"}
            modifiers={{
              offset: {
                enabled: true,
                offset: "0, 15",
              },
              applyStyle: {
                enabled: true,
              },
            }}
            elevation={8}
            className={classes.searchPopper}
          >
            <Box className={classes.searchResults}>
              {called && !loading ? (
                <NavigationSearchResults
                  results={data.project_list_view}
                  handleDropdownClose={handleDropdownClose}
                  searchTerm={searchTerm}
                />
              ) : (
                <Typography>
                  {" "}
                  Search Results {/*todo: eventually be the previous results*/}
                </Typography>
              )}
            </Box>
          </Popper>
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default NavigationSearchInput;
