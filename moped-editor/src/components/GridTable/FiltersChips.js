import React from "react";
import { Box, Typography, Chip, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

/**
 * The styling for the FilterChips components
 * @type {Object}
 * @constant
 */
const useStyles = makeStyles((theme) => ({
  filtersList: {
    paddingTop: theme.spacing(1),
    marginRight: "12px",
    display: "flex",
    alignItems: "start",
  },
  filtersText: {
    fontFamily: "Roboto",
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
 * Renders filters applied in advanced search
 * @param {Object} filtersConfig - The filters configuration for the current table
 * @param {Array|Objects} filters - applied filters
 * @param {Boolean} isOr - true if ANY filters are matched, false if ALL
 * @return {JSX.Element}
 * @constructor
 */
const FiltersChips = ({ filters, isOr, filtersConfig }) => {
  const classes = useStyles();

  const filtersApplied = filters.map((filter) => {
    const fieldFilterConfig = filtersConfig.fields.find(
      (fieldConfig) => fieldConfig.name === filter.field
    );
    const fieldOperatorConfig = filtersConfig.operators[filter.operator];
    return (
      <>
        <span style={{ fontWeight: 600 }}> {fieldFilterConfig?.label} </span>{" "}
        {fieldOperatorConfig?.label} {filter.value}
      </>
    );
  });

  return (
    <Box className={classes.filtersList}>
      <Typography className={classes.filtersText}>
        <Grid container alignItems={"center"} spacing={0.5}>
          <Grid item spacing={0.25}>
            {makeFilteredByText(filters, isOr)}{" "}
          </Grid>
          {filtersApplied.map((filter, index) => (
            <Grid item spacing={0.25}>
              <Chip key={index} label={filter} />
            </Grid>
          ))}
        </Grid>
      </Typography>
    </Box>
  );
};

export default FiltersChips;
