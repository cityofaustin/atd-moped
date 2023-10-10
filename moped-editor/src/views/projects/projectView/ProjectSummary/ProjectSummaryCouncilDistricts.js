import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import getCouncilDistricts from "src/utils/getCouncilDistricts"


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
        Council district(s):
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
