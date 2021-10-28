import React from "react";
import { Grid } from "@material-ui/core";
import ProjectSummaryLabel from "./ProjectSummaryLabel";

/**
 * ProjectSummaryStatusUpdate Component
 * @param {Number} projectId - The id of the current project being viewed
 * @param {Object} data - The data object from the GraphQL query
 * @param {function} refetch - The refetch function from apollo
 * @param {Object} classes - The shared style settings
 * @returns {JSX.Element}
 * @constructor
 */
const ProjectSummaryProjectSponsor = ({
  projectId,
  data,
  refetch,
  classes,
}) => {
  return (
    <Grid item xs={12} className={classes.fieldGridItem}>
      <ProjectSummaryLabel label={"Project Sponsor"} />
    </Grid>
  );
};

export default ProjectSummaryProjectSponsor;
