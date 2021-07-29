import React, { useState } from "react";
import { IconButton, Popover, Typography, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    marginRight: "1em",
  },
}));

/**
 * @return {JSX.Element}
 * @constructor
 */
const NavigationSearchInput = () => {
  const classes = useStyles();

  const [searchInput, showSearchInput] = useState(false);
  // anchor element for menu to "attach" to
  const [searchResultsAnchor, setSearchResultsAnchor] = useState(null);

  const setShowSearchInput = () => showSearchInput(searchInput => !searchInput);

  const handleMagClick = event => {
    setSearchResultsAnchor(event.currentTarget); // this actually shouldnt happen until the input gets focus?
    showSearchInput(true);
  };

  const handleMagClose = () => {
    setSearchResultsAnchor(null);
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={handleMagClick}>
        <SearchIcon />
      </IconButton>
      <Popover
        id="searchResults"
        open={Boolean(searchResultsAnchor)}
        anchorEl={searchResultsAnchor}
        onClose={handleMagClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Typography> Search Results </Typography>
      </Popover>
    </div>
  );
};

export default NavigationSearchInput;
