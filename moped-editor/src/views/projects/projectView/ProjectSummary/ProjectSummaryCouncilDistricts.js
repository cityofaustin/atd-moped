import React from "react";
import { Box, Grid, Typography } from "@mui/material";

// reduce the array of geography objects into an array of city council districts
const reduceDistricts = (data) => {
  const initialValue = [];
  const districts = data.reduce(
    (acc, component) => [...acc, component["council_districts"]],
    initialValue
  );

  // flatten the array of arrays and remove empty districts
  const districtsArray = districts.flat().filter((d) => d);
  return districtsArray;
};

const getAllCouncilDistricts = (projectGeography, childProjectGeography) => {
  const projectDistricts = reduceDistricts(projectGeography);
  const childDistricts = reduceDistricts(childProjectGeography);
  const allDistricts = projectDistricts.concat(childDistricts);
  // sort in ascending order and use Set to only return unique districts
  return [...new Set(allDistricts.sort((a, b) => a - b))];
};

/**
 * ProjectSummaryCouncilDistricts Component
 * @param {Object} data - The project geography from the graphql query's data object
 * @param {Object} classes - The shared style settings
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryCouncilDistricts = ({
  projectGeography,
  classes,
  childProjectGeography,
}) => {
  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <Typography className={classes.fieldLabel}>
        Council district(s)
      </Typography>
      <Box className={classes.fieldBox}>
        <Typography className={classes.fieldLabelTextNoHover}>
          {getAllCouncilDistricts(projectGeography, childProjectGeography).join(
            ", "
          )}
        </Typography>
      </Box>
    </Grid>
  );
};

export default ProjectSummaryCouncilDistricts;
