import React from "react";
import PropTypes from "prop-types";

import { Box, Button, makeStyles, Icon } from "@material-ui/core";
import { NavLink as RouterLink } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1),
  },
  exportButton: {
    marginRight: theme.spacing(1),
  },
}));

const GridTableExport = ({ query }) => {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button className={classes.importButton}>Import</Button>
      <Button className={classes.exportButton}>Export</Button>
      <Button
        color="primary"
        variant="contained"
        component={RouterLink}
        to={"/moped/projects/new"}
        startIcon={<Icon>add_circle</Icon>}
      >
        New Project
      </Button>
    </Box>
  );
};

GridTableExport.propTypes = {
  className: PropTypes.string,
};

export default GridTableExport;
