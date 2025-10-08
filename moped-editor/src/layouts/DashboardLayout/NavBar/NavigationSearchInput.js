import React, { useState, useEffect } from "react";
import {
  Box,
  ClickAwayListener,
  IconButton,
  InputBase,
  Popper,
  Slide,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useLazyQuery } from "@apollo/client";
import { NAVIGATION_SEARCH_QUERY_CONFIG } from "./NavigationSearchQueryConf";
import NavigationSearchResults from "./NavigationSearchResults.js";
import { useNavigationSearch } from "./useNavigationSearchQuery";

// Reusable style fragments
const searchContainerBaseSx = {
  backgroundColor: "background.paper",
  overflow: "hidden",
};

const searchContainer404Sx = {
  ...searchContainerBaseSx,
  borderRadius: "4px",
  width: { xs: "400px", sm: "400px", md: "400px", lg: "600px" },
  height: "44px",
  cursor: "pointer",
};

const searchContainerDefaultSx = {
  ...searchContainerBaseSx,
  mr: { sm: "20px" },
};

const inputBaseCommonSx = {
  borderWidth: 1,
  borderRadius: "4px",
  borderColor: "rgba(0,0,0, .23)",
  borderStyle: "solid",
  p: "2px",
  height: "44px",
  "&:hover": { borderColor: "text.secondary" },
  "&.Mui-focused": {
    borderWidth: 2,
    borderColor: "primary.main",
    "&:hover": { borderColor: "primary.main" },
  },
  "&.MuiInputBase-adornedStart": {
    color: "text.secondary",
    pl: "5px",
  },
  "& .MuiInputBase-input": {
    fontSize: { xs: "0.75rem", sm: "0.75rem", md: "0.75rem", lg: "0.875rem" },
    pl: "1em",
    color: "text.primary",
  },
};

const resultsBoxCommonSx = {
  borderWidth: 1,
  borderRadius: "4px",
  borderStyle: "solid",
  borderColor: "background.default",
  backgroundColor: "background.paper",
  color: "text.primary",
};

/**
 * @return {JSX.Element}
 * @constructor
 */
const NavigationSearchInput = ({ input404Class }) => {
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
        <Box
          ref={divRef}
          sx={input404Class ? searchContainer404Sx : searchContainerDefaultSx}
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
                sx={{
                  ...inputBaseCommonSx,
                  width: input404Class
                    ? { xs: "400px", sm: "400px", md: "400px", lg: "600px" }
                    : { xs: "200px", sm: "200px", md: "200px", lg: "300px" },
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
            modifiers={[]}
            sx={{
              width: input404Class
                ? { xs: "400px", sm: "400px", md: "400px", lg: "600px" }
                : { xs: "200px", sm: "200px", md: "200px", lg: "300px" },
              overflow: "hidden",
              borderRadius: "4px",
              ...(popperEnterComplete && {
                boxShadow:
                  "0 0 1px 0 rgb(0 0 0 / 31%), 0 3px 3px -3px rgb(0 0 0 / 25%)",
              }),
            }}
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
              <Box sx={resultsBoxCommonSx}>
                {called && !loading && !!searchTerm.length > 0 && (
                  <NavigationSearchResults
                    results={data?.project_list_view || []}
                    handleDropdownClose={handleDropdownClose}
                    searchTerm={searchTerm}
                  />
                )}
              </Box>
            </Slide>
          </Popper>
        </Box>
      </ClickAwayListener>
    </Box>
  );
};

export default NavigationSearchInput;
