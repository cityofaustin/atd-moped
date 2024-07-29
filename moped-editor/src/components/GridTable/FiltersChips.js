import React from "react";
import { Box, Typography, Chip, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  filtersList: {
    paddingTop: theme.spacing(1),
    display: "flex",
    alignItems: "start",
  },
  filtersText: {
    fontFamily: "Roboto",
    fontSize: ".9rem",
    color: theme.palette.text.secondary,
  },
}));

/**
 * Renders filters applied in advanced search
 * @param {Object} filtersConfig - The filters configuration for the current table
 * @param {Array|Objects} filters - applied filters
 * @param {Boolean} isOr - true if ANY filters are matched, false if ALL
 * @return {JSX.Element}
 * @constructor
 */
const FiltersChips = ({ filters, setFilters, isOr, filtersConfig }) => {
  const classes = useStyles();
  console.log(filters)

  const filtersCount = Object.keys(filters).length;

  const filtersLabels = filters.map((filter) => {
    const fieldFilterConfig = filtersConfig.fields.find(
      (fieldConfig) => fieldConfig.name === filter.field
    );
    const fieldOperatorConfig = filtersConfig.operators[filter.operator];
    return {
      filterLabel: fieldFilterConfig?.label,
      operatorLabel: fieldOperatorConfig?.label,
      filterValue: filter.value,
    };
  });

  const handleDeleteButtonClick = (filterIndex) => {
    /* Clone the state, delete the filter index of the button clicked, and update filter state */
    const filtersNewState = [...filters];
    filtersNewState.splice(filterIndex, 1);
    setFilters(filtersNewState);
  };

  return (
    <Box className={classes.filtersList}>
      <Typography className={classes.filtersText} component="span">
        <Grid container alignItems={"center"} spacing={0.5}>
          {filtersCount > 1 && (
            <Grid item spacing={0.25}>
              <Chip
                variant="outlined"
                label={
                  isOr ? (
                    <>
                      Matching
                      <span style={{ fontWeight: 600 }}> any </span> filter
                    </>
                  ) : (
                    <>
                      Matching
                      <span style={{ fontWeight: 600 }}> all </span> filters
                    </>
                  )
                }
              />
            </Grid>
          )}
          {filtersLabels.map((filter, index) => (
            <Grid item spacing={0.25} key={index}> {// I need to update this spacing 
              }
              <Chip
                onDelete={()=>handleDeleteButtonClick(index)}
                key={index}
                label={
                  <>
                    <span style={{ fontWeight: 600 }}>
                      {filter.filterLabel}
                    </span>{" "}
                    {filter.operatorLabel} {filter.filterValue}
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
