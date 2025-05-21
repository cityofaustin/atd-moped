import React from "react";
import { Divider, List, ListItem, ListItemText } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    marginRight: "1em",
  },
  padding: {
    paddingTop: "0px",
    paddingBottom: "0px",
  },
  listItemSecondaryAction: {
    fontSize: "1.125rem",
  },
}));

const ListItemLink = (props) => (
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
          <ListItemText primary="No results found" />
        </ListItem>
      </List>
    );
  }

  return (
    <List className={classes.padding}>
      {firstResults.map((result) => (
        <ListItemLink
          to={`/moped/projects/${result.project_id}`}
          onClick={handleDropdownClose}
          key={result.project_id}
        >
          <ListItemText
            primary={result.project_name_full}
            secondary={result.project_id}
          />
        </ListItemLink>
      ))}
      {results.length > 5 && (
        // Link to project list view with simple search populated
        <>
          <Divider />
          <ListItemLink
            to={`/moped/projects?search=${searchTerm}`}
            onClick={handleDropdownClose}
            reloadDocument
          >
            <ListItemText primary="More results" />
            <ArrowForwardIosIcon className={classes.listItemSecondaryAction} />
          </ListItemLink>
        </>
      )}
    </List>
  );
};

export default NavigationSearchResults;
