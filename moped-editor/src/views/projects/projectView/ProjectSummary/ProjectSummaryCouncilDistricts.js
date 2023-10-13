import React from "react";
import { Box, Grid, Typography } from "@mui/material";

// reduce the array of geography objects into an array of city council districts
const getCouncilDistricts = (data) => {
  const initialValue = [];
  const districts = data.reduce(
    (acc, component) => [...acc, component["council_districts"]],
    initialValue
  );

  // flatten the array of arrays and remove empty districts
  const districtsArray = districts.flat().filter((d) => d);

  // sort in ascending order and use Set to only return unique districts
  return [...new Set(districtsArray.sort((a, b) => a - b))];
};

/**
 * ProjectSummaryCouncilDistricts Component
 * @param {Object} data - The project geography from the graphql query's data object
 * @param {Object} classes - The shared style settings
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryCouncilDistricts = ({ projectGeography, classes }) => {
  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>
        Council district(s)
      </Typography>
      <Box className={classes.fieldBox}>
        <Typography className={classes.fieldLabelTextNoHover}>
          {getCouncilDistricts(projectGeography).join(", ")}
        </Typography>
      </Box>
    </Grid>
  );
};

export default ProjectSummaryCouncilDistricts;
