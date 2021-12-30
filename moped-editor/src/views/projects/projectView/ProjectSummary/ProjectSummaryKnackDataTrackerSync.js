import React from "react";
import {
  Box,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";

import { OpenInNew, Autorenew } from "@material-ui/icons";

import ProjectSummaryLabel from "./ProjectSummaryLabel";

/**
 * Function to build the correct Knack URL to interact with based on properties and if there will be an
 * update or an initial sync.
 * @returns string
 */
 const buildUrl = (scene, view, knackProjectId) => {
  let url = `https://api.knack.com/v1/pages/scene_${scene}/views/view_${view}/records`;
  if (knackProjectId) {
    // existing record
    url = url + "/" + knackProjectId;
  }
  return url;
};

/**
 * Function to determine the HTTP method to use base on if there will be an update or initial post to Knack
 * @returns string
 */
 const getHttpMethod = knackProjectId => {
  //return project?.knack_project_id ?? false ? "PUT" : "POST";
  let method = knackProjectId ?? false ? "PUT" : "POST";
  console.log("knackProjectId: ", knackProjectId);
  console.log("HTTP Method: ", method);
  return knackProjectId ?? false ? "PUT" : "POST";
};

const ProjectSummaryKnackDataTrackerSync = ({
  classes,
  project,
}) => {

  let knackEndpointUrl = buildUrl(
    process.env.REACT_APP_KNACK_DATA_TRACKER_SCENE,
    process.env.REACT_APP_KNACK_DATA_TRACKER_VIEW,
    project?.knackProjectId,
  );

  let knackHttpMethod = getHttpMethod(project?.knack_project_id);


  return (
    <>
      <Grid item xs={12} className={classes.fieldGridItem}>
        <Typography className={classes.fieldLabel}>
          Data Tracker signal IDs
        </Typography>
        <Box
          display="flex"
          justifyContent="flex-start"
        >
          <ProjectSummaryLabel
            text={
              (project.knack_project_id && (
                <Link
                  href={'https://atd.knack.com/amd#projects/project-details/' + project.knack_project_id}
                  target={"_blank"}
                >
                  {'View in Data Tracker'} <OpenInNew className={classes.linkIcon} />
                </Link>
              )) || (
                <>
                  <Link 
                    className={classes.fieldLabelText}
                    onClick={() => {
                      console.log('clicked')
                    }}
                  >
                    {'Synchronize'}<Autorenew viewBox={"0 -4 22 26"} className={classes.syncLinkIcon} />
                  </Link>
                </>
              )}
            classes={classes}
            spanClassName={''}
          />
        </Box>
      </Grid>
    </>
  )

};

export default ProjectSummaryKnackDataTrackerSync;