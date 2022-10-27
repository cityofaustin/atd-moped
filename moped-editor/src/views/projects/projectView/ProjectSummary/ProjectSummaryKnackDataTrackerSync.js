import React from "react";
import { Box, Grid, Link, Typography } from "@material-ui/core";
import { Autorenew } from "@material-ui/icons";
import { useMutation } from "@apollo/client";

import { UPDATE_PROJECT_KNACK_ID } from "../../../../queries/project";
import ProjectSummaryLabel from "./ProjectSummaryLabel";
import RenderSignalLink from "../../signalProjectTable/RenderSignalLink";

/**
 * Function to build the correct Knack URL to interact with based on properties and if there will be an
 * update or an initial sync.
 * @returns string
 */
const buildProjectUrl = (scene, view, knackProjectId) => {
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
  return knackProjectId ?? false ? "PUT" : "POST";
};

/**
 * Function to map the signal IDs from a project object into an array and return the array length.
 * @returns integer
 */
const getProjectSignals = project => {
  const allProjectFeatures = project.moped_proj_components
    .map(projectComponent => {
      // for each component, extract feature geojson from each project feature (moped_proj_features.feature)
      // every feature must have a feature.feature jsonb, but we'll nullish chain just to be safe
      return projectComponent.moped_proj_features.map(
        feature => feature?.feature
      );
    })
    // then flatten this array of feature arrays
    .flat()
    // and filter any undefined components, which should never happen
    .filter(feature => feature);
  // now filter our features for only those with a `signal_id` property
  const allProjectSignals = allProjectFeatures.filter(
    feature => feature.properties?.signal_id
  );
  // and shape the object we need to render links and such
  return allProjectSignals.map(signal => {
    return {
      signal_id: signal.properties.signal_id,
      knack_id: signal.properties.id,
    };
  });
};

const ProjectSummaryKnackDataTrackerSync = ({
  classes,
  project,
  refetch,
  snackbarHandle,
}) => {
  let knackProjectEndpointUrl = buildProjectUrl(
    process.env.REACT_APP_KNACK_DATA_TRACKER_SCENE,
    process.env.REACT_APP_KNACK_DATA_TRACKER_PROJECT_VIEW,
    project?.knack_project_id
  );

  const [mutateProjectKnackId] = useMutation(UPDATE_PROJECT_KNACK_ID);

  // Array of signals in project
  const signals = getProjectSignals(project);

  let knackHttpMethod = getHttpMethod(project?.knack_project_id);

  /**
   * Object to hold headers which need to be sent as part of the a Knack API call
   */
  const buildHeaders = {
    "Content-Type": "application/json",
    "X-Knack-Application-Id": process.env.REACT_APP_KNACK_DATA_TRACKER_APP_ID,
    "X-Knack-REST-API-Key": "knack",
  };

  /**
   * Function to build up a JSON object of the fields which need to be updated in a call to Knack. This is needed
   * because if you update the project number field, even with the same, extant number, Knack returns an error.
   * @returns string
   */
  const buildBody = signalIds => {
    let body = {};

    const knackFieldsRegEx = /REACT_APP_KNACK_DATA_TRACKER_(\w+)_FIELD/;
    const fieldMap = {};

    Object.keys(process.env)
      .filter(envVariable => envVariable.match(knackFieldsRegEx))
      .map(envVariable => envVariable.match(knackFieldsRegEx))
      .forEach(
        regExResult =>
          (fieldMap[process.env[regExResult[0]]] = regExResult[1].toLowerCase())
      );

    const url =
      process.env.REACT_APP_KNACK_DATA_TRACKER_URL_BASE + project.project_id;

    const url_payload = {
      url: url,
      label: project.project_name,
    };

    body[process.env.REACT_APP_KNACK_DATA_TRACKER_MOPED_URL] = url;
    body[process.env.REACT_APP_KNACK_DATA_TRACKER_MOPED_LINK_LABEL] =
      project.project_name;
    body[
      process.env.REACT_APP_KNACK_DATA_TRACKER_MOPED_LINK_LABEL
    ] = url_payload;

    Object.keys(fieldMap).forEach(element => {
      body[element] = project[fieldMap[element]];
    });
    // REACT_APP_KNACK_DATA_TRACKER_SIGNAL_CONNECTION contains the signalId connection field to the signals table
    // it's ok if the signalIds array is empty
    body[
      process.env.REACT_APP_KNACK_DATA_TRACKER_SIGNAL_CONNECTION
    ] = signalIds;

    return JSON.stringify(body);
  };

  /**
   * Function to handle the actual mechanics of synchronizing the data on hand to the Knack API endpoint.
   */
  const handleSync = () => {
    // The following code is capable of handling a "re-sync" to knack for a given project.
    // Currently, our UI does not contain an element that allows a user to request a re-sync, but
    // this code is ready to "re-sync" a project thanks to its use of a dynamic knackHttpMethod
    console.log("HTTP method: " + knackHttpMethod);
    // POST (create) or PUT (update) a project record in Knack
    const signalIds = signals.map(signal => signal.knack_id);
    return fetch(knackProjectEndpointUrl, {
      method: knackHttpMethod,
      headers: buildHeaders,
      body: buildBody(signalIds),
    })
      .then(response => response.json())
      .then(result => {
        if (result.errors) {
          // Successful HTTP request, but knack indicates an error with the query, such as non-existent ID
          throw result;
        }
        return result;
      })
      .then(knackRecord => {
        // We've got an ID from the Knack endpoint for this project, so record it in our database
        // This ID will not have changed as we were merely updating a project
        mutateProjectKnackId({
          variables: {
            project_id: project.project_id,
            knack_id: knackRecord.record.id,
          },
        });
      })
      .then(() => refetch()) // ask the application to update its status from our graphql endpoint
      .then(() => {
        // End of the chain; advise the user of success
        snackbarHandle(
          true,
          "Success: Project data synchronized with Data Tracker",
          "success"
        );
      })
      .catch(error => {
        // Failure, alert the user that we've encountered an error
        console.error(error);
        snackbarHandle(true, "Error: Data Tracker sync failed.", "warning");
      });
  };

  return (
    <>
      <Grid item xs={12} className={classes.fieldGridItem}>
        <Typography className={classes.fieldLabel}>Signal IDs</Typography>
        <Box display="flex" justifyContent="flex-start">
          <ProjectSummaryLabel
          className={classes.fieldLabelDataTrackerLink}
            text={
              // if a project has been synced with Knack and has signals associated, link to signals
              (project.knack_project_id && signals.length > 0 && (
                <RenderSignalLink signals={signals} />
              )) || (
                // otherwise render link to synchronize with knack
                <>
                  <Link
                    id="projectKnackSyncLink"
                    className={classes.knackFieldLabelText}
                    onClick={() => {
                      handleSync();
                    }}
                  >
                    {"Synchronize with Data Tracker"}
                    <Autorenew
                      viewBox={"0 -4 22 26"}
                      className={classes.syncLinkIcon}
                    />
                  </Link>
                </>
              )
            }
            classes={classes}
            spanClassName={classes.fieldLabelTextSpanNoBorder}
          />
        </Box>
      </Grid>
    </>
  );
};

export default ProjectSummaryKnackDataTrackerSync;
