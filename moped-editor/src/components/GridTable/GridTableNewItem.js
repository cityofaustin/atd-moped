import React from "react";
import PropTypes from "prop-types";

import { Box, Button, Icon } from "@material-ui/core";
import { NavLink as RouterLink } from "react-router-dom";

/**
 * Based on GQLAbstract configuration, renders add new Item button
 * @param {GQLAbstract} query - The GQLAbstract query object that provides the configuration
 * @return {JSX.Element}
 * @constructor
 */
const GridTableNewItem = ({ query }) => {
  return (
    <Box display="flex" justifyContent="flex-end">
      {query.config.customNewItemButton || (
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

GridTableNewItem.propTypes = {
  className: PropTypes.string,
};

export default GridTableNewItem;
