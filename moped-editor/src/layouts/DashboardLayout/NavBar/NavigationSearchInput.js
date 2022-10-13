import React, { useState, useEffect } from "react";
import {
  Box,
  ClickAwayListener,
  IconButton,
  InputBase,
  Popper,
  Slide,
  makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import SearchIcon from "@material-ui/icons/Search";
import GQLAbstract from "../../../libs/GQLAbstract";
import { useLazyQuery } from "@apollo/client";
import { ProjectsListViewQueryConf } from "../../../views/projects/projectsListView/ProjectsListViewQueryConf";
import NavigationSearchResults from "./NavigationSearchResults.js";
import { getSearchValue } from "../../../utils/gridTableHelpers";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("sm")]: {
      marginRight: "20px",
    },
    // overflow hidden makes it so the popper does not slide in from edge of screen
    // but instead appears to come in from edge of div
    overflow: "hidden",
  },
  root404: {
    borderRadius: "4px",
    backgroundColor: theme.palette.background.paper,
    [theme.breakpoints.up("sm")]: {
      width: "600px",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "400px",
    },
    // overflow hidden makes it so the popper does not slide in from edge of screen
    // but instead appears to come in from edge of div
    overflow: "hidden",
    height: "44px",
    cursor: "pointer",
  },
  inputRoot: {
    borderWidth: "1px",
    borderRadius: "4px",
    borderColor: "rgba(0,0,0, .23)",
    "&:hover": {
      borderColor: theme.palette.text.secondary,
    },
    borderStyle: "solid",
    padding: "2px",
    [theme.breakpoints.up("sm")]: {
      width: "300px",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "200px",
    },
    height: "44px",
  },
  inputRoot404: {
    borderWidth: "1px",
    borderRadius: "4px",
    borderColor: "rgba(0,0,0, .23)",
    "&:hover": {
      borderColor: theme.palette.text.secondary,
    },
    borderStyle: "solid",
    padding: "2px",
    [theme.breakpoints.up("sm")]: {
      width: "600px",
    },
    [theme.breakpoints.down("sm")]: {
      maxWidth: "400px",
    },
    height: "44px",
  },
  inputInput: {
    [theme.breakpoints.up("sm")]: {
      fontSize: "0.875rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.75rem",
    },
    paddingLeft: "1em",
    color: theme.palette.text.primary,
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
    "&:hover": {
      borderColor: theme.palette.primary.main,
    },
  },
  searchPopper: {
    [theme.breakpoints.up("sm")]: {
      width: "300px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "200px",
    },
    overflow: "hidden",
    borderRadius: "4px",
  },
  searchPopper404: {
    [theme.breakpoints.up("sm")]: {
      width: "600px",
    },
    [theme.breakpoints.down("sm")]: {
      width: "400px",
    },
    overflow: "hidden",
    borderRadius: "4px",
  },
  // separate style so it can be applied after animation completes
  searchPopperShadow: {
    boxShadow: "0 0 1px 0 rgb(0 0 0 / 31%), 0 3px 3px -3px rgb(0 0 0 / 25%)",
  },
  searchResults: {
    borderWidth: "1px",
    borderRadius: "4px",
    borderStyle: "solid",
    borderColor: theme.palette.background.default,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  searchResultsPlaceholder: {
    padding: "16px",
  },
}));

/**
 * @return {JSX.Element}
 * @constructor
 */
const NavigationSearchInput = ({ input404Class }) => {
  const classes = useStyles();
  const divRef = React.useRef();
  let projectSearchQuery = new GQLAbstract(ProjectsListViewQueryConf);

  // Toggle Text Input or magnifying glass
  const [searchInput, showSearchInput] = useState(false);
  // anchor element for results popper to "attach" to
  const [searchResultsAnchor, setSearchResultsAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // keep track if popper animation has completed so border can be applied
  const [popperEnterComplete, setPopperEntered] = useState(false);
  // boolean used to initiate slide animation
  const [showSlideIn, toggleSlideIn] = useState(false);

  const [loadSearchResults, { called, loading, data }] = useLazyQuery(
    projectSearchQuery.gql,
    projectSearchQuery.config.options.useQuery
  );

  // when magnifying glass icon is clicked, show search bar and initiate animation
  const handleMagClick = () => {
    showSearchInput(true);
    toggleSlideIn(true);
  };

  // reset state when popper is closed or search result is clicked
  const handleDropdownClose = () => {
    setSearchResultsAnchor(null);
    showSearchInput(false);
    setSearchTerm("");
    setPopperEntered(false);
  };

  // show popper results when search input gets focus
  const handleSearchFocus = () => {
    setSearchResultsAnchor(divRef.current);
    toggleSlideIn(true);
  };

  // initiate exiting animation when clicking outside of search bar / popper results
  const startSlideAway = () => {
    setSearchTerm("");
    setPopperEntered(false);
    toggleSlideIn(false);
  };

  // reset/remove search input and popper
  // triggered once exiting animation is completed
  const resetSearchInput = () => {
    setSearchResultsAnchor(null);
    showSearchInput(false);
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

  /**
   * Formats search term and triggers lazy query to load search results
   * @param {event} - Event that triggered submission
   */
  const handleSearchSubmission = event => {
    // Stop if we don't have any value entered in the search field
    if (searchTerm.length === 0) {
      return;
    }

    // Prevent default behavior on any event
    if (event) event.preventDefault();

    // Formats search query based on project search columns and config
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

    // Initiate Lazy Query to get search results
    loadSearchResults();
  };

  // Search as user updates searchTerm
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearchSubmission(null);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <Box display="flex" justifyContent="center" onClick={handleMagClick}>
      <ClickAwayListener onClickAway={startSlideAway}>
        <div
          className={input404Class ? classes.root404 : classes.root}
          ref={divRef}
        >
          {!searchInput ? (
            <IconButton>
              <SearchIcon />
            </IconButton>
          ) : (
            <Slide
              direction="left"
              in={showSlideIn}
              timeout={300}
              onExited={resetSearchInput}
            >
              <InputBase
                placeholder="Project ID, name, description or eCAPRIS ID"
                classes={{
                  root: input404Class
                    ? classes.inputRoot404
                    : classes.inputRoot,
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
                autoFocus
              />
            </Slide>
          )}
          <Popper
            id="searchResults"
            open={Boolean(searchResultsAnchor)}
            anchorEl={searchResultsAnchor}
            onClose={handleDropdownClose}
            placement={"bottom-start"}
            modifiers={
              !input404Class && {
                offset: {
                  enabled: true,
                  offset: "0, 15",
                },
              }
            }
            // disablePortal=true ensures the popper wont slip behind the material tables
            disablePortal
            className={clsx(
              input404Class ? classes.searchPopper404 : classes.searchPopper,
              {
                // only apply dropshadow after component has fully slid into position
                [classes.searchPopperShadow]: popperEnterComplete,
              }
            )}
            // need transition prop since child components include Slide
            transition
          >
            <Slide
              direction="left"
              in={showSlideIn}
              timeout={300}
              onEntered={() => setPopperEntered(true)}
            >
              <Box className={classes.searchResults}>
                {called && !loading && (
                  <NavigationSearchResults
                    results={data.project_list_view}
                    handleDropdownClose={handleDropdownClose}
                    searchTerm={searchTerm}
                  />
                )}
              </Box>
            </Slide>
          </Popper>
        </div>
      </ClickAwayListener>
    </Box>
  );
};

export default NavigationSearchInput;
