import React from "react";
import PropTypes from "prop-types";

import { Box, Button, Icon } from "@material-ui/core";
import { NavLink as RouterLink } from "react-router-dom";

/**
 * Renders the GridTableExport functionality
 * @param {GQLAbstract} query - The GQLAbstract query object that provides the configuration
 * @param {Object} showFilterState - The state/state-change bundle object
 * @return {JSX.Element}
 * @constructor
 */
const GridTableExport = ({ query }) => {
  return (
    <Box display="flex" justifyContent="flex-end">
      {(query.config.showNewItemButton && query.config.customNewItemButton) ||
        (query.config.showNewItemButton && (
          <Button
            color="primary"
            variant="contained"
            component={RouterLink}
            to={query.config.new_item}
            startIcon={<Icon>add_circle</Icon>}
          >
            {query.config.new_item_label}
          </Button>
        ))}
    </Box>
  );
};

GridTableExport.propTypes = {
  className: PropTypes.string,
};

export default GridTableExport;
