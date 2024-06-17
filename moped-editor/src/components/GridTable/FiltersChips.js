import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

/**
 * The styling for the FilterChips components
 * @type {Object}
 * @constant
 */
const useStyles = makeStyles((theme) => ({
  advancedSearchSelected: {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    height: "33px",
    width: "33px",
    color: "rgba(0, 0, 0, 0.54)",
  },
  advancedSearchActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.background.paper,
    height: "33px",
    width: "33px",
  },
  tuneIcon: {
    height: "33px",
    width: "33px",
    color: "rgba(0, 0, 0, 0.54)",
  },
  filtersList: {
    paddingTop: theme.spacing(1),
    marginRight: "12px",
  },
  filtersText: {
    fontSize: ".9rem",
    color: theme.palette.text.secondary,
  },
  filtersSpan: {
    fontWeight: 600,
    textTransform: "uppercase",
  },
}));

/**
 * Create text to show advanced filters and logic applied in the UI
 * @param {Object} filters - The current filters applied
 * @param {Boolean} isOr - The current logic applied
 * @returns {string} - The text to display
 */
const makeFilteredByText = (filters, isOr) => {
  const filtersCount = Object.keys(filters).length;
  let filteredByText = "Filtered by ";

  /* Only show logic string if more than one filter applied */
  if (filtersCount === 1) return filteredByText;

  if (isOr) {
    filteredByText += "any ";
  } else {
    filteredByText += "all ";
  }

  return filteredByText;
};

/**
 * Renders a search bar with optional filters
 * @param {Object} filtersConfig - The filters configuration for the current table
 * @return {JSX.Element}
 * @constructor
 */
const FiltersChips = ({ filters, isOr, filtersConfig }) => {
  const classes = useStyles();

  console.log(filters);

  const filtersApplied = filters.map((filter) => {
    const fieldFilterConfig = filtersConfig.fields.find(
      (fieldConfig) => fieldConfig.name === filter.field
    );
    return fieldFilterConfig?.label;
  });

  console.log(filtersApplied);
  return (
    <Box className={classes.filtersList}>
      <Typography align="right" className={classes.filtersText}>
        {makeFilteredByText(filters, isOr)}{" "}
        <span className={classes.filtersSpan}>{`${filtersApplied.join(
          ", "
        )}`}</span>
      </Typography>
    </Box>
  );
};

export default FiltersChips;
