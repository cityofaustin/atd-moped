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
      {query.config.showExport && (
        <>
          <Button className={classes.importButton}>Import</Button>
          <Button className={classes.exportButton}>Export</Button>
        </>
      )}

      {query.config.showNewItemButton && (
        <Button
          color="primary"
          variant="contained"
          component={RouterLink}
          to={query.config.new_item}
          startIcon={<Icon>add_circle</Icon>}
        >
          {query.config.new_item_label}
        </Button>
      )}
    </Box>
  );
};

GridTableExport.propTypes = {
  className: PropTypes.string,
};

export default GridTableExport;
