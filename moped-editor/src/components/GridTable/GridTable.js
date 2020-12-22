import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

import {
  Box,
  CircularProgress,
  Container,
  Paper,
  TableContainer,
} from "@material-ui/core";

// Abstract & GridTable
import {useQuery} from "@apollo/react-hooks";
import GridTableToolbar from "./GridTableToolbar";
import GridTableList from "./GridTableList";

/**
 * GridTable Style
 */
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));





/**
 * GridTable Component for Material UI
 * @param {string} title - The title header of the component
 * @param {Object} query - The GraphQL query configuration
 * @param {Object} filters - Filter configuration
 * @param {string[]} columnsToExport - An array of strings containing the names of columns to export
 * @param {Object} aggregateQueryConfig - Aggregate query configuration
 * @constructor
 */
const GridTable = ({
  title,
  query,
  filters,
  columnsToExport,
  aggregateQueryConfig,
}) => {
  // Load up the styles
  const classes = useStyles();
  const { data, loading, error } = useQuery(query.gql);

  /**
   * State Management
   */
  const [searchKeyword, setSearchKeyword] = useState("");
  const [projectList, setProjectList] = useState([]);

  const filterSearch = event => {
    setSearchKeyword(event.target.value);
  };

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (data) {
      const currentProjectList = data.moped_project.filter(item => {
        return item.project_name
            .toString()
            .toLowerCase()
            .includes(searchKeyword.toLowerCase());
      });
      setProjectList(currentProjectList);
    }
  }, [data, searchKeyword]);

  return (
    <Container maxWidth={false} className={classes.root}>
      <GridTableToolbar change={filterSearch} />
      <Paper className={classes.paper}>
        <Box mt={3}>
          {loading ? <CircularProgress /> : <GridTableList projects={projectList}/>}
        </Box>
      </Paper>
    </Container>
  );
};

export default GridTable;
