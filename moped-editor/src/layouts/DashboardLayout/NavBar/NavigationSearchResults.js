import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const listPaddingStyles = { paddingX: 0 };

const ListItemLink = (props) => (
  <ListItemButton component={RouterLink} {...props} />
);

const NavigationSearchResults = ({
  results,
  handleDropdownClose,
  searchTerm,
}) => {
  const firstResults = results.slice(0, 5);

  if (results.length === 0) {
    return (
      <List sx={listPaddingStyles}>
        <ListItem>
          <ListItemText primary="No results found" />
        </ListItem>
      </List>
    );
  }

  return (
    <List sx={listPaddingStyles}>
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
            <ArrowForwardIosIcon sx={{ fontSize: "1.125rem" }} />
          </ListItemLink>
        </>
      )}
    </List>
  );
};

export default NavigationSearchResults;
