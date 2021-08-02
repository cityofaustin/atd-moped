import React from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText /*makeStyles*/,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

// const useStyles = makeStyles(theme => ({
//   root: {
//     backgroundColor: theme.palette.background.paper,
//     marginRight: "1em",
//   },
// }));

const ListItemLink = props => (
  <ListItem button component={RouterLink} {...props} />
);

const NavigationSearchResults = ({ results }) => {
  // const classes = useStyles();
  console.log(results);
  const firstResults = results.slice(0, 5);

  if (results.length === 0) {
    return (
      <List>
        <ListItem>
          <ListItemText primary="No Results found" />
        </ListItem>
      </List>
    );
  }

  return (
    <List>
      {firstResults.map(result => (
        <ListItemLink to={`projects/${result.project_id}`}>
          <ListItemText primary={result.project_name} />
        </ListItemLink>
      ))}
      {results.length > 5 && (
        <>
          <Divider />
          <ListItemLink to={`projects/`}>
            <ListItemText primary="More Results" />
          </ListItemLink>
        </>
      )}
    </List>
  );
};

export default NavigationSearchResults;
