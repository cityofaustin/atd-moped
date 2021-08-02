import React from "react";
import { List, ListItem, ListItemText, /*makeStyles*/ } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

// const useStyles = makeStyles(theme => ({
//   root: {
//     backgroundColor: theme.palette.background.paper,
//     marginRight: "1em",
//   },
// }));

const ListItemLink = (props) => <ListItem button component={RouterLink} {...props} />;

const NavigationSearchResults = ({results}) => {
  // const classes = useStyles();

  if (results.length === 0) {
    return (
      <List>
        <ListItem><ListItemText primary="No Results found" /></ListItem>
      </List>
      )
  }

  return (
    <List>
    {results.map(result => (
      <ListItemLink to={`projects/${result.project_id}`}>
        <ListItemText primary={result.project_name} />
      </ListItemLink>
      ))
    }
  </List>
    )
}

export default NavigationSearchResults;
