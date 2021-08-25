import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    marginRight: "1em",
  },
  padding: {
    paddingTop: "0px",
    paddingBottom: "0px",
  },
}));

const ListItemLink = props => (
  <ListItem button component={RouterLink} {...props} />
);

const NavigationSearchResults = ({
  results,
  handleDropdownClose,
  searchTerm,
}) => {
  const classes = useStyles();
  const firstResults = results.slice(0, 5);

  if (results.length === 0) {
    return (
      <List className={classes.padding}>
        <ListItem>
          <ListItemText primary="No Results found" />
        </ListItem>
      </List>
    );
  }

  return (
    <List className={classes.padding}>
      {firstResults.map(result => (
        <ListItemLink
          to={`projects/${result.project_id}`}
          onClick={handleDropdownClose}
        >
          <ListItemText primary={result.project_name} />
        </ListItemLink>
      ))}
      {results.length > 5 && (
        <>
          <Divider />
          <ListItemLink
            to={`projects/`}
            // send searchTerm in location state
            state={{ searchTerm: searchTerm }}
            onClick={handleDropdownClose}
          >
            <ListItemText primary="More results" />
            <ArrowForwardIosIcon />
          </ListItemLink>
        </>
      )}
    </List>
  );
};

export default NavigationSearchResults;
