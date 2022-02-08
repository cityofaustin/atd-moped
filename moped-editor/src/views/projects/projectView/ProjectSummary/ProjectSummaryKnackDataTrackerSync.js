import React from "react";
import { Box, Grid, Link, Typography, Button } from "@material-ui/core";
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
const countSignalsInProject = project => {
  const signalIds = project.moped_proj_features.map(
    feature => feature.location.properties.signal_id
  );
  return Promise.resolve(signalIds.length);
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

  let knackSignalEndpointUrl =
    `https://api.knack.com/v1/pages/scene_${process.env.REACT_APP_KNACK_DATA_TRACKER_SCENE}` +
    `/views/view_${process.env.REACT_APP_KNACK_DATA_TRACKER_SIGNAL_VIEW}/records`;

  // Array of signals in project
  const signals = project.moped_proj_features
    .filter(feature => feature?.location?.properties?.signal_id)
    .map(feature => ({
      signal_id: feature.location.properties.signal_id,
      knack_id: feature.location.properties.id,
    }));

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
      .filter(envVariable => {
        return envVariable.match(knackFieldsRegEx);
      })
      .map(envVariable => {
        return envVariable.match(knackFieldsRegEx);
      })
      .forEach(regExResult => {
        fieldMap[process.env[regExResult[0]]] = regExResult[1].toLowerCase();
      });

    Object.keys(fieldMap).forEach(element => {
      body[element] = project[fieldMap[element]];
    });

    if (signalIds.length > 0) {
      // REACT_APP_KNACK_DATA_TRACKER_SIGNAL_CONNECTION contains the signalId connection field to the signals table
      body[
        process.env.REACT_APP_KNACK_DATA_TRACKER_SIGNAL_CONNECTION
      ] = signalIds;
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
  };

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
            // Throw error & cause the promise to fall through to the .catch() method
            throw result;
          } else {
            // Successful HTTP request with meaningful results from Knack
            project.currentKnackState = result; // this assignment operates on `project` which is defined in broader scope than this function

            return countSignalsInProject(project)
              .then(signalCount => {
                if (signalCount > 0) {
                  return fetch(
                    knackSignalEndpointUrl +
                      "?filters=" +
                      buildSignalIdFilters(project),
                    {
                      // Fetch will return a promise, which we'll use to start a chain of .then() steps
                      method: "GET",
                      headers: buildHeaders,
                    }
                  )
                    .then(response => response.json()) // get the json payload and pass it along
                    .then(result => {
                      let signalIds = [];
                      if (signalCount > 0) {
                        signalIds = result.records.map(record => record.id);
                      }
                      return signalIds;
                    });
                } else {
                  return [];
                }
              })
              .then(signalIds => {
                console.log("about to act with: " + knackHttpMethod);
                return fetch(knackProjectEndpointUrl, {
                  method: knackHttpMethod,
                  headers: buildHeaders,
                  body: buildBody(signalIds),
                });
              });
          }
        })
        .then(response => response.json())
        .then(result => {
          if (result.errors) {
            // Successful HTTP request, but knack indicates an error with the query, such as non-existent ID
            throw result;
          } else {
            // Successful HTTP Update request with meaningful results from Knack
            return true;
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
          return true;
        })
        .catch(error => {
          // Failure, alert the user that we've encountered an error
          console.error(error);
          snackbarHandle(true, "Error: Data Tracker update failed.", "warning");
        });
    } else {
      // creating new knack record execution branch
      project.currentKnackState = {};

      countSignalsInProject(project)
        .then(signalCount => {
          if (signalCount > 0) {
            return fetch(
              knackSignalEndpointUrl +
                "?filters=" +
                buildSignalIdFilters(project),
              {
                // Fetch will return a promise, which we'll use to start a chain of .then() steps
                method: "GET",
                headers: buildHeaders,
              }
            )
              .then(response => response.json()) // get the json payload and pass it along
              .then(result => {
                let signalIds = [];
                if (signalCount > 0) {
                  signalIds = result.records.map(record => record.id);
                }
                return signalIds;
              });
          } else {
            return [];
          }
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
          // I think this may need to be result?.errors
          if (result.errors) {
            // Successful HTTP request, but knack indicates an error with the query, such as non-existent ID.
            throw result;
          }
          return result;
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
          return true;
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
        <Typography className={classes.fieldLabel}>Signal IDs</Typography>
        <Box display="flex" justifyContent="flex-start">
          <ProjectSummaryLabel
            text={
              // if a project has been synced with Knack and has signals associated, link to signals
              (project.knack_project_id && signals.length > 0 && (
                <RenderSignalLink signals={signals} />
              )) || (
                // otherwise render link to synchronize with knack
                <>
                  <Link
                    className={classes.fieldLabelText}
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
        <Box>
          <Button
            className={classes.fieldLabelText}
            onClick={() => {
              handleSync();
            }}
          >
            Resync
          </Button>
        </Box>
      </Grid>
    </>
  );
};

export default ProjectSummaryKnackDataTrackerSync;
