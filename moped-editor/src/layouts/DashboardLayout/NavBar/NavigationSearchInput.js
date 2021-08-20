import React, { useState, useEffect } from "react";
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
import { getSearchValue } from "../../../components/GridTable/GridTable.js";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up('sm')]: {
      marginRight: "1em",
    },
  },
  inputRoot: {
    borderWidth: "1px",
    borderRadius: "4px",
    borderColor: theme.palette.text.secondary,
    borderStyle: "solid",
    padding: "2px",
    [theme.breakpoints.up('sm')]: {
      width: "300px",
    },
    [theme.breakpoints.down('sm')]: {
      width: "200px",
    },
    height: "36px",
  },
  inputInput: {
    [theme.breakpoints.up('sm')]: {
      fontSize: "0.875rem",
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: "0.75rem",
    },
    paddingLeft: "1em",
  },
  adornedStart: {
    color: theme.palette.text.secondary,
    paddingLeft: "5px",
  },
  inputFocused: {
    borderWidth: "2px",
    borderRadius: "4px",
    borderStyle: "solid",
    borderColor: theme.palette.primary.main,
  },
  searchPopper: {
    borderWidth: "1px",
    borderRadius: "4px",
    borderStyle: "solid",
    borderColor: theme.palette.background.default,
    [theme.breakpoints.up('sm')]: {
      width: "300px",
    },
    [theme.breakpoints.down('sm')]: {
      width: "200px",
    },
    boxShadow:"0 0 1px 0 rgb(0 0 0 / 31%), 0 3px 3px -3px rgb(0 0 0 / 25%)"
  },
  searchResults: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "4px",
    color: theme.palette.text.primary,
  },
  tempResults: {
    padding: "16px",
  }
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
    setSearchTerm("");
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
    Object.keys(projectSearchQuery.config.columns)
      .filter(column => projectSearchQuery.config.columns[column]?.searchable)
      .forEach(column => {
        const {
          operator,
          quoted,
          envelope,
        } = projectSearchQuery.config.columns[column].search;
        const searchValue = getSearchValue(
          projectSearchQuery,
          column,
          searchTerm
        );
        const graphqlSearchValue = quoted
          ? `"${envelope.replace("{VALUE}", searchValue)}"`
          : searchValue;

        projectSearchQuery.setOr(column, `${operator}: ${graphqlSearchValue}`);
      });
    loadSearchResults();
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearchSubmission(null);
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

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
                focused: classes.inputFocused,
              }}
              inputProps={{ "aria-label": "search" }}
              startAdornment={<SearchIcon fontSize={"small"} />}
              onFocus={handleSearchFocus}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => handleKeyDown(e.key)}
              value={searchTerm}
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
              }
            }}
            // disablePortal=true ensures the popper wont slip behind the material tables
            disablePortal
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
                <Typography className={classes.tempResults}>
                  {" "}
                  Search Results
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
