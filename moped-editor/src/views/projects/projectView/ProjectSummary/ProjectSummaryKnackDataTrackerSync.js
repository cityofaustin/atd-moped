import React from "react";
import { Box, Grid, Link, Typography } from "@material-ui/core";
import { OpenInNew, Autorenew } from "@material-ui/icons";
import { useMutation } from "@apollo/client";

import { UPDATE_PROJECT_KNACK_ID } from "../../../../queries/project";
import ProjectSummaryLabel from "./ProjectSummaryLabel";

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

const countSignalsInProject = (project) => {
  const signalIds = project.moped_proj_features.map(
    feature => feature.location.properties.signal_id
  );
  return signalIds.length;
}

const ProjectSummaryKnackDataTrackerSync = ({
  classes,
  project,
  refetch,
  snackbarHandle,
}) => {
  let knackProjectEndpointUrl = buildProjectUrl(
    process.env.REACT_APP_KNACK_DATA_TRACKER_SCENE,
    process.env.REACT_APP_KNACK_DATA_TRACKER_PROJECT_VIEW,
    project?.knackProjectId
  );

  let knackSignalEndpointUrl =
    `https://api.knack.com/v1/pages/scene_${process.env.REACT_APP_KNACK_DATA_TRACKER_SCENE}` +
    `/views/view_${process.env.REACT_APP_KNACK_DATA_TRACKER_SIGNAL_VIEW}/records`;

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

    const field_map = {
      field_3998: "project_id",
      field_3999: "project_name",
      field_4000: "current_status",
    };

    Object.keys(field_map).forEach(element => {
      if (project.currentKnackState[element] !== project[field_map[element]]) {
        body[element] = project[field_map[element]];
      }
    });

    if (signalIds.length > 0) {
      // field_3861 is the signalId connection field to the signals table
      body["field_3861"] = signalIds;
    }

    return JSON.stringify(body);
  };

  const buildSignalIdFilters = project => {
    // signals: scene_514 view_1483
    const signalIds = project.moped_proj_features.map(
      feature => feature.location.properties.signal_id
    );

    let getSignalFilter = {
      match: "or",
      rules: signalIds.map(signalId => {
        return {
          field: "field_199",
          operator: "is",
          value: signalId,
        };
      }),
    };
    return JSON.stringify(getSignalFilter);
    //return encodeURIComponent(JSON.stringify(getSignalFilter));
  };

  const [mutateProjectKnackId] = useMutation(UPDATE_PROJECT_KNACK_ID);

  /**
   * Function to handle the actual mechanics of synchronizing the data on hand to the Knack API endpoint.
   */
  const handleSync = () => {
    if (project.knack_project_id) {
      // updating knack record
      fetch(knackProjectEndpointUrl, {
        // Fetch will return a promise, allowing us to start a chain of .then() calls
        method: "GET",
        headers: buildHeaders,
      })
        .then(response => response.json()) // get the json payload, passing it the next step
        .then(result => {
          if (result.errors) {
            // Successful HTTP request, but knack indicates an error with the query, such as non-existent ID.
            // Reject the promise to fall through to the .catch() method
            return Promise.reject(result);
          } else {
            // Successful HTTP request with meaningful results from Knack
            project.currentKnackState = result; // this assignment operates on `project` which is defined in broader scope than this function
            return fetch(knackProjectEndpointUrl, {
              // fetch returns a Promise for the next step
              method: knackHttpMethod,
              headers: buildHeaders,
              body: buildBody(),
            });
          }
        })
        .then(response => response.json())
        .then(result => {
          if (result.errors) {
            // Successful HTTP request, but knack indicates an error with the query, such as non-existent ID
            return Promise.reject(result);
          } else {
            // Successful HTTP Update request with meaningful results from Knack
            return Promise.resolve();
          }
        })
        .then(() => refetch()) // ask the application to update its status from our graphql endpoint
        .then(() => {
          // End of the chain; advise the user of success
          snackbarHandle(
            true,
            "Success: Project updated in Data Tracker",
            "success"
          );
          return Promise.resolve();
        })
        .catch(error => {
          // Failure, alert the user that we've encountered an error
          console.error(error);
          snackbarHandle(true, "Error: Data Tracker update failed.", "warning");
        });
    } else {
      // creating new knack record execution branch
      project.currentKnackState = {};

      // nb: need to use conditional checks to see if we're going to need to fetch signalIds
      // pattern to follow: https://vijayt.com/post/conditional-promise-chaining-pattern-better-code/

      fetch(
        knackSignalEndpointUrl + "?filters=" + buildSignalIdFilters(project),
        {
          // Fetch will return a promise, which we'll use to start a chain of .then() steps
          method: "GET",
          headers: buildHeaders,
        }
      )
        .then(response => response.json()) // get the json payload and pass it along
        .then(result => {
          const signalCount = countSignalsInProject(project);
          let signalIds = [];
          if (signalCount > 0) {
            signalIds = result.records.map(record => record.id);
          }
          return signalIds;
        })
        .then(signalIds => {
          return fetch(knackProjectEndpointUrl, {
            method: knackHttpMethod,
            headers: buildHeaders,
            body: buildBody(signalIds),
          });
        })
        .then(response => response.json())
        .then(result => {
          if (result.errors) {
            // Successful HTTP request, but knack indicates an error with the query, such as non-existent ID.
            // Reject this promise so we fall through to the .catch() method
            return Promise.reject(result);
          }
          return Promise.resolve(result); // pass result object onto next .then()
        })
        .then(knack_record =>
          // We've got an ID from the Knack endpoint for this project, so record it in our database
          mutateProjectKnackId({
            variables: {
              project_id: project.project_id,
              knack_id: knack_record.record.id,
            },
          })
        )
        .then(() => refetch()) // ask the application to update its status from our graphql endpoint
        .then(() => {
          // End of the chain; advise the user of success
          snackbarHandle(
            true,
            "Success: Project data pushed to Data Tracker",
            "success"
          );
          return Promise.resolve();
        })
        .catch(error => {
          // Failure, alert the user that we've encountered an error
          console.error(error);
          snackbarHandle(
            true,
            "Error: Data Tracker initial sync failed.",
            "warning"
          );
        });
    } // end of the creating new knack record branch
  };

  return (
    <>
      <Grid item xs={12} className={classes.fieldGridItem}>
        <Typography className={classes.fieldLabel}>
          Data Tracker signal IDs
        </Typography>
        <Box display="flex" justifyContent="flex-start">
          <ProjectSummaryLabel
            text={
              (project.knack_project_id && (
                <Link
                  href={
                    "https://atd.knack.com/amd#projects/project-details/" +
                    project.knack_project_id
                  }
                  target={"_blank"}
                >
                  {"View in Data Tracker"}{" "}
                  <OpenInNew className={classes.linkIcon} />
                </Link>
              )) || (
                <>
                  <Link
                    className={classes.fieldLabelText}
                    onClick={() => {
                      handleSync();
                    }}
                  >
                    {"Synchronize"}
                    <Autorenew
                      viewBox={"0 -4 22 26"}
                      className={classes.syncLinkIcon}
                    />
                  </Link>
                </>
              )
            }
            classes={classes}
            spanClassName={""}
          />
        </Box>
      </Grid>
    </>
  );
};

export default ProjectSummaryKnackDataTrackerSync;
