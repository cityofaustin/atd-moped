import React from "react";
import { Box, Typography, Chip, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

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
 * Create text to show logic applied in the UI
 * @param {Boolean} isOr - The current logic applied
 * @returns {string} - The text to display
 */
const makeFilteredByText = (isOr) => {
  console.log(isOr);
  if (isOr) {
    return (
      <>
        Matching
        <span style={{ fontWeight: 600 }}> any </span> filter
      </>
    );
  } else {
    return (
      <>
        Matching
        <span style={{ fontWeight: 600 }}> all </span> filters
      </>
    );
  }
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

  const filtersCount = Object.keys(filters).length;

  const filtersLabels = filters.map((filter) => {
    const fieldFilterConfig = filtersConfig.fields.find(
      (fieldConfig) => fieldConfig.name === filter.field
    );
    const fieldOperatorConfig = filtersConfig.operators[filter.operator];
    return [fieldFilterConfig?.label, fieldOperatorConfig?.label, filter.value];
  });

  return (
    <Box className={classes.filtersList}>
      <Typography className={classes.filtersText}>
        <Grid container alignItems={"center"} spacing={0.5}>
          {filtersCount > 1 && (
            <Grid item spacing={0.25}>
              <Chip label={makeFilteredByText(isOr)} />
            </Grid>
          )}
          {filtersLabels.map((filter, index) => (
            <Grid item spacing={0.25}>
              <Chip
                key={index}
                label={
                  <>
                    <span style={{ fontWeight: 600 }}> {filter[0]} </span>{" "}
                    {filter[1]} {filter[2]}
                  </>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Typography>
    </Box>
  );
};

export default FiltersChips;
