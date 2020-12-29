import React, { useState } from "react";
import PropTypes from "prop-types";

import { Box, Card, CardContent } from "@material-ui/core";
import GridTableFilters from "./GridTableFilters";
import GridTableSearchBar from "./GridTableSearchBar";

const GridTableSearch = ({ query, children }) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div>
      {children}
      <Box mt={3}>
        <Card>
          <CardContent>
            <GridTableSearchBar
              query={query}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
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
