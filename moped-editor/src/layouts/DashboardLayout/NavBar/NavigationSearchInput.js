import React, { useState, useEffect } from "react";
import {
  Box,
  ClickAwayListener,
  IconButton,
  InputBase,
  Popper,
  Slide,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import SearchIcon from "@mui/icons-material/Search";
import { useLazyQuery } from "@apollo/client";
import { NAVIGATION_SEARCH_QUERY_CONFIG } from "./NavigationSearchQueryConf";
import NavigationSearchResults from "./NavigationSearchResults.js";
import { useNavigationSearch } from "./useNavigationSearchQuery";

const useStyles = makeStyles((theme) => ({
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
    [theme.breakpoints.down("md")]: {
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
    [theme.breakpoints.down("md")]: {
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
    [theme.breakpoints.down("md")]: {
      maxWidth: "400px",
    },
    height: "44px",
  },
  inputInput: {
    [theme.breakpoints.up("sm")]: {
      fontSize: "0.875rem",
    },
    [theme.breakpoints.down("md")]: {
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
    [theme.breakpoints.down("md")]: {
      width: "200px",
    },
    overflow: "hidden",
    borderRadius: "4px",
  },
  searchPopper404: {
    [theme.breakpoints.up("sm")]: {
      width: "600px",
    },
    [theme.breakpoints.down("md")]: {
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
}));

/**
 * @return {JSX.Element}
 * @constructor
 */
const NavigationSearchInput = ({ input404Class }) => {
  const classes = useStyles();
  const divRef = React.useRef();

  // Toggle Text Input or magnifying glass
  const [searchInput, showSearchInput] = useState(false);
  // anchor element for results popper to "attach" to
  const [searchResultsAnchor, setSearchResultsAnchor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // keep track if popper animation has completed so border can be applied
  const [popperEnterComplete, setPopperEntered] = useState(false);
  // boolean used to initiate slide animation
  const [showSlideIn, toggleSlideIn] = useState(false);
  // format search query based on search term
  const navSearchQuery = useNavigationSearch({ searchTerm });

  const [loadSearchResults, { called, loading, data }] = useLazyQuery(
    navSearchQuery.query,
    NAVIGATION_SEARCH_QUERY_CONFIG.options.useQuery
  );

  /* Clear input */
  const clearSearchInput = () => {
    setSearchTerm("");
  };

  // when magnifying glass icon is clicked, show search bar and initiate animation
  const handleMagClick = () => {
    showSearchInput(true);
    toggleSlideIn(true);
  };

  // reset state when popper is closed or search result is clicked
  const handleDropdownClose = () => {
    setSearchResultsAnchor(null);
    showSearchInput(false);
    setPopperEntered(false);
    clearSearchInput();
  };

  // show popper results when search input gets focus
  const handleSearchFocus = () => {
    setSearchResultsAnchor(divRef.current);
    toggleSlideIn(true);
  };

  // initiate exiting animation when clicking outside of search bar / popper results
  const startSlideAway = () => {
    clearSearchInput();
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
  const handleKeyDown = (key) => {
    switch (key) {
      // On Escape key, clear the search
      case "Escape":
        setSearchResultsAnchor(null);
        // Slide away the search bar and reset the input
        toggleSlideIn(false);
        clearSearchInput();
        break;
      default:
        return;
    }
  };

  // Search as user updates searchTerm
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length === 0) {
        return;
      }

      // Initiate Lazy Query to get search results
      loadSearchResults();
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
            <IconButton size="large">
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
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e.key)}
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
            placement="bottom-start"
            // inherit the position from the modifiers and dont reset to 0
            style={{ position: "fixed", top: "unset", left: "unset" }}
            // disablePortal=true ensures the popper wont slip behind the material tables
            disablePortal
            modifiers={[]}
            className={clsx(
              input404Class ? classes.searchPopper404 : classes.searchPopper,
              {
                // only apply dropshadow after component has fully slid into position
                [classes.searchPopperShadow]: popperEnterComplete,
              }
            )}
            // including the transition prop counter intuitively messes up the positioning
            // transition
          >
            <Slide
              direction="left"
              in={showSlideIn}
              timeout={300}
              onEntered={() => setPopperEntered(true)}
              container={searchResultsAnchor}
            >
              <Box className={classes.searchResults}>
                {called && !loading && (
                  <NavigationSearchResults
                    results={data?.project_list_view || []}
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
