import React, { useState } from "react";
import { Card, CardContent, IconButton, InputBase, Popper, Typography, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

import { GQLAbstract } from "atd-kickstand";
import { ProjectsListViewQueryConf } from "../../../views/projects/projectsListView/ProjectsListViewQueryConf";
import { useLazyQuery } from "@apollo/client";

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
    paddingLeft: "5px"
  },
  searchResults: {
    padding: "10px",
    backgoundColor: "green",
    zIndex:100,
  }
}));

/**
 * Load Query Configuration as a mutable object
 * @type {GQLAbstract}
 */
let projectsQuery = new GQLAbstract(ProjectsListViewQueryConf);

/**
 * @return {JSX.Element}
 * @constructor
 */
const NavigationSearchInput = () => {
  const classes = useStyles();
  const divRef = React.useRef();

  // should text input be shown or just magnifying glass
  const [searchInput, showSearchInput] = useState(false);
  // anchor element for results popper to "attach" to
  const [searchResultsAnchor, setSearchResultsAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [loadSearchResults, { called, loading, data }] = useLazyQuery(
    projectsQuery.gql,
    projectsQuery.config.options.useQuery
  );

  // const setShowSearchInput = () => showSearchInput(searchInput => !searchInput);

  const handleMagClick = () => {
    showSearchInput(true);
  };

  const handleMagClose = () => { // maybe this should be handle search blur
    setSearchResultsAnchor(null);
  };

  const handleSearchFocus =() => {
    setSearchResultsAnchor(divRef.current);
  }

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

  // import from gridtable?
  const getSearchValue = (column, value) => {
    // Retrieve the type of field (string, float, int, etc)
    const type = projectsQuery.config.columns[column].type.toLowerCase();
    // Get the invalidValueDefault in the search config object
    const invalidValueDefault =
      projectsQuery.config.columns[column].search?.invalidValueDefault ?? null;
    // If the type is number of float, attempt to parse as such
    if (["number", "float", "double"].includes(type)) {
      value = Number.parseFloat(value) || invalidValueDefault;
    }
    // If integer, attempt to parse as integer
    if (["int", "integer"].includes(type)) {
      value = Number.parseInt(value) || invalidValueDefault;
    }
    // Any other value types are pass-through for now
    return value;
  };

  const handleSearchSubmission = event => {
    // Stop if we don't have any value entered in the search field
    if (searchTerm.length === 0) {
      console.log("no search term")
    }

    // Prevent default behavior on any event
    if (event) event.preventDefault();

    // Update state if we are ready, triggers search.
    console.log(`searching ${searchTerm}`)
    Object.keys(projectsQuery.config.columns)
      .filter(column => projectsQuery.config.columns[column]?.searchable)
      .forEach(column => {
        const { operator, quoted, envelope } = projectsQuery.config.columns[
          column
        ].search;
        const searchValue = getSearchValue(column, searchTerm);
        const graphqlSearchValue = quoted
          ? `"${envelope.replace("{VALUE}", searchValue)}"`
          : searchValue;

        projectsQuery.setOr(column, `${operator}: ${graphqlSearchValue}`);
      });
    loadSearchResults();
  };

  if (called && !loading) {
    console.log(data)
  } else {
    console.log(projectsQuery)
  }

  return (
    <>
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
          startAdornment={<SearchIcon fontSize={"small"}/>}
          onFocus={handleSearchFocus}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => handleKeyDown(e.key)}
          value={searchTerm}
        />
      )}
    </div>
      <Popper
        id="searchResults"
        open={Boolean(searchResultsAnchor)}
        anchorEl={searchResultsAnchor}
        onClose={handleMagClose}
        placement={"bottom-start"}
        elevation={3}
      >
      <Card
        className={classes.searchResults}
      >
        <CardContent>
          {(called && !loading)
            ? data.project_list_view.map(result => (
              <Typography> {result.project_name}</Typography>
              )) 
            : <Typography> Search Results </Typography>
          }
        </CardContent>
        <Typography> More Results </Typography> {/* a link with the search terms passed into it to the projects list page?*/}
        </Card>
      </Popper>
    </>
  );
};

export default NavigationSearchInput;
