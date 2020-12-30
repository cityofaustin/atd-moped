import React, { useState } from "react";
import PropTypes from "prop-types";

import { Box, Card, CardContent } from "@material-ui/core";
import GridTableFilters from "./GridTableFilters";
import GridTableSearchBar from "./GridTableSearchBar";

/**
 * Renders a table search component with a search bar and search filters
 * @param {GQLAbstract} query - The GQLAbstract object as provided by the parent component
 * @param searchState - The current state/state-modifier bundle for search
 * @param {JSX.Element} children - Any components to be rendered above the search bar
 * @return {JSX.Element}
 * @constructor
 */
const GridTableSearch = ({ query, searchState, children }) => {
  /**
   * If true, it shows the filters in the UI, else it hides them.
   * @type {boolean} searchFieldValue
   * @function setShowFilters - Sets the state of searchFieldValue
   * @default {false}
   */
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div>
      {children}
      <Box mt={3}>
        <Card>
          <CardContent>
            <GridTableSearchBar
              query={query}
              searchState={searchState}
              showFilterState={{
                showFilters: showFilters,
                setShowFilters: setShowFilters,
              }}
            />
            {showFilters && <GridTableFilters query={query} />}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

GridTableSearch.propTypes = {
  className: PropTypes.string,
};

export default GridTableSearch;
