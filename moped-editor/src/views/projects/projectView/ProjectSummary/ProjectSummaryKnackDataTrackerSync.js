import React, { useMemo } from "react";
import { Box, Grid, Link, Typography } from "@mui/material";
import { Autorenew } from "@mui/icons-material";
import { useMutation } from "@apollo/client";

import { UPDATE_PROJECT_KNACK_ID } from "../../../../queries/project";
import ProjectSummaryLabel from "./ProjectSummaryLabel";
import RenderSignalLink from "../../../../components/RenderSignalLink";

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
const getHttpMethod = (knackProjectId) => {
  return knackProjectId ?? false ? "PUT" : "POST";
};

/**
 * Function to map the signal IDs from a project object into an array and return the array length.
 * @returns integer
 */
const useProjectSignals = (project) =>
  useMemo(
    () =>
      project.moped_proj_components
        .map((component) => component.feature_signals)
        .flat()
        .filter((signal) => !!signal),
    [project]
  );

/**
 * Object to hold headers which need to be sent as part of the a Knack API call
 */
const REQUEST_HEADERS = {
  "Content-Type": "application/json",
  "X-Knack-Application-Id": process.env.REACT_APP_KNACK_DATA_TRACKER_APP_ID,
  "X-Knack-REST-API-Key": "knack",
};

const FIELD_MAP = {
  production: {
    project_id: "field_4133",
    project_name: "field_3857",
    current_phase_name: "field_4136",
    signals_connection: "field_3861",
    moped_url_object: "field_4162",
  },
  other: {
    project_id: "field_4133",
    project_name: "field_3857",
    current_phase_name: "field_4136",
    signals_connection: "field_3861",
    moped_url_object: "field_4162",
  },
};

const getUrlObject = (project) => {
  const url =
    process.env.REACT_APP_KNACK_DATA_TRACKER_URL_BASE + project.project_id;
  return {
    url: url,
    label: project.project_name,
  };
};

/**
 * Exract project's current phase name from projet data - assumes the 0-index project phase
 * is the project's current phase
 * @param {object} project - project as returned from our SUMMARY_QUERY
 * @returns
 */
const getCurrentPhase = (project) =>
  project.moped_proj_phases?.[0].moped_phase.phase_name || null;

/**
 * Function to build up a JSON object of the fields which need to be updated in a call to Knack. This is needed
 * because if you update the project number field, even with the same, extant number, Knack returns an error.
 * @param {object} project - project data as returned from our SUMMARY_QUERY
 * @param {[object]} signals - array of from the feature_signals table
 * @returns string
 */
const buildBody = (project, signals) => {
  process.env.REACT_APP_HASURA_ENV !== "production" &&
    console.warn(`
    Warning: It's not possible to test this feature outside of a produciton environment,
    because our signals' unique knack record identifiers only exist in production.
    To test, you can patch in a valid knack ID by uncommenting the line below that sets
    body.signals_connection.
  `);
  // get the field map
  const fieldMap =
    process.env.REACT_APP_HASURA_ENV === "production"
      ? FIELD_MAP.production
      : FIELD_MAP.other;

  // make a copy of it to use as our payload
  const body = { ...fieldMap };

  body.project_id = project.project_id;
  body.project_name = project.project_name;
  body.moped_url_object = getUrlObject(project);
  body.current_phase_name = getCurrentPhase(project);

  const signalIds = signals.map((signal) => signal.knack_id);
  body.signals_connection = signalIds;
  // uncomment this line to test this request against the Knack test env - this is signal ID #2 - GUADALUPE ST / LAMAR BLVD
  // body.signals_connection = ["62195eedf538d8072b16a0f6"];

  // payload is ready - replace keys with knack fieldnames
  Object.keys(fieldMap).forEach((key) => {
    body[fieldMap[key]] = body[key];
    delete body[key];
  });
  return JSON.stringify(body);
};

/**
 * This feature enables the user to create a "project" record in Arterial Management
 * Data Tracker app - a knack application used for asset management.
 *
 * Any Moped user can push any project to the Data Tracker. If the project has signal
 * components, the project created in Knack will have ties to the signal records in
 * Knack. These linkages are formed by including the signal's knack record ID, which
 * acts a foreign key to the signals table in the Data Tracker. If the project does not
 * have signal components, that's fine.
 *
 * Although this component has logic to *update* (instead of create) a project record
 * in Knack (with a PUT request) — we currently do not provide the users with this
 * option. The "Sync w/ Data Tracker" button is hidden once a project is created.
 */
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
  const signals = useProjectSignals(project);
  let knackHttpMethod = getHttpMethod(project?.knack_project_id);

  /**
   * Function to handle the actual mechanics of synchronizing the data on hand to the Knack API endpoint.
   */
  const handleSync = () => {
    // The following code is capable of handling a "re-sync" to knack for a given project.
    // Currently, our UI does not contain an element that allows a user to request a re-sync, but
    // this code is ready to "re-sync" a project thanks to its use of a dynamic knackHttpMethod
    console.log("HTTP method: " + knackHttpMethod);
    // POST (create) or PUT (update) a project record in Knack
    return fetch(knackProjectEndpointUrl, {
      method: knackHttpMethod,
      headers: REQUEST_HEADERS,
      body: buildBody(project, signals),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.errors) {
          // Successful HTTP request, but knack indicates an error with the query, such as non-existent ID
          throw result;
        }
        return result;
      })
      .then((knackRecord) => {
        // We've got an ID from the Knack endpoint for this project, so record it in our database
        // This ID will not have changed as we were merely updating a project
        mutateProjectKnackId({
          variables: {
            project_id: project.project_id,
            knack_id: knackRecord.record.id,
          },
        })
          // ask the application to update its status from our graphql endpoint
          .then(() => refetch())
          .then(() =>
            // End of the chain; advise the user of success
            snackbarHandle(
              true,
              "Success: Project data synchronized with Data Tracker",
              "success"
            )
          );
      })
      .catch((error) => {
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
