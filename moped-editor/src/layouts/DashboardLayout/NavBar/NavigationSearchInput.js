import React, { useState } from "react";
import { Card, CardContent, IconButton, InputBase, Popper, Typography, makeStyles } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

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
 * @return {JSX.Element}
 * @constructor
 */
const NavigationSearchInput = () => {
  const classes = useStyles();
  const divRef = React.useRef();

  const [searchInput, showSearchInput] = useState(false);
  // anchor element for menu to "attach" to
  const [searchResultsAnchor, setSearchResultsAnchor] = useState(null);

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
        <Typography> Search Results </Typography>
        </CardContent>
        </Card>
      </Popper>
    </>
  );
};

export default NavigationSearchInput;
