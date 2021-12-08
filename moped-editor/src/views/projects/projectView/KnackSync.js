import React from "react";
import { MenuItem, Icon, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useMutation } from "@apollo/client";

import { UPDATE_PROJECT_KNACK_ID } from "../../../queries/project";

const useStyles = makeStyles(theme => ({
  projectOptionsMenuItemIcon: {
    minWidth: "2rem",
  },
}));

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

/**
 * Entry in project menu drop down to trigger sync to Data Tracker
 * @return {JSX.Element}
 * @constructor
 */
const KnackSync = React.forwardRef(
  ({ project, closeHandler, snackbarHandler, refetch }, ref) => {
    const classes = useStyles();

    let knackEndpointUrl = buildUrl(
      process.env.REACT_APP_KNACK_DATA_TRACKER_SCENE,
      process.env.REACT_APP_KNACK_DATA_TRACKER_VIEW,
      project.knack_project_id
    );

    console.log("Project: ", project);

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
    const buildBody = () => {
      let body = {};

      const field_map = {
        field_3998: "project_id",
        field_3999: "project_name",
        field_4000: "current_status",
      };

      Object.keys(field_map).forEach(element => {
        if (
          project.currentKnackState[element] !== project[field_map[element]]
        ) {
          body[element] = project[field_map[element]];
        }
      });

      return JSON.stringify(body);
    };

    const [mutateProjectKnackId] = useMutation(UPDATE_PROJECT_KNACK_ID);

    /**
     * Function to handle the actual mechanics of synchronizing the data on hand to the Knack API endpoint.
     */
    const handleSync = () => {
      if (project.knack_project_id) {
        // updating knack record
        fetch(knackEndpointUrl, {
          // start the process with a fetch, which is a Promise
          method: "GET",
          headers: buildHeaders,
        })
          .then(response => response.json()) // get the json payload, and the .json() method returns a Promise
          .then(
            result => {
              // We'll see the following pattern again in the code
              if (result.errors) {
                // Successful HTTP request, but knack indicates an error with the query, such as non-existent ID
                return Promise.reject(result);
              } else {
                // Successful HTTP request with meaningful results from Knack
                project.currentKnackState = result; // this assignment operates on `project` which is defined in broader scope than this function
                return fetch(knackEndpointUrl, {
                  // fetch returns a Promise
                  method: knackHttpMethod,
                  headers: buildHeaders,
                  body: buildBody(),
                });
              }
            }
          )
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
            snackbarHandler({
              severity: "success",
              message: "Success: Project data updated in Data Tracker.",
            });
            return Promise.resolve();
          })
          .catch(error => {
            // Failure, alert the user that we've encountered an error
            console.error(error);
            snackbarHandler({
              severity: "warning",
              message: "Error: Data Tracker update failed.",
            });
          });
      } else {
        // creating new knack record execution branch
        project.currentKnackState = {};
        fetch(knackEndpointUrl, {
          // start the process with a fetch, which is a Promise
          method: knackHttpMethod,
          headers: buildHeaders,
          body: buildBody(),
        })
          .then(response => response.json())
          .then(result => {
            if (result.errors) {
              // Successful HTTP request, but knack indicates an error with the query, such as non-existent ID
              return Promise.reject(result);
            } 
            return Promise.resolve(result); // pass result object onto next .then()
          })
          .then((knack_record) => 
            mutateProjectKnackId({
              // Apollo will return a promise as well
              variables: {
                project_id: project.project_id,
                knack_id: knack_record.record.id,
              },
            })
          )
          .then(() => refetch()) // ask the application to update its status from our graphql endpoint
          .then(() => {
            // End of the chain; advise the user of success
            snackbarHandler({
              severity: "success",
              message: "Success: Project data pushed to Data Tracker.",
            });
            return Promise.resolve();
          })
          .catch(error => {
            // Failure, alert the user that we've encountered an error
            console.error(error);
            snackbarHandler({
              severity: "warning",
              message: "Error: Data Tracker initial sync failed.",
            });
          });
      } // end of the creating new knack record branch

      closeHandler(); // this is used to close the Menulist
    };

    return (
      <MenuItem onClick={handleSync} selected={false}>
        <ListItemIcon className={classes.projectOptionsMenuItemIcon}>
          <Icon fontSize="small">cached</Icon>
        </ListItemIcon>
        <ListItemText primary="Sync to Data Tracker" />
      </MenuItem>
    );
  }
);

export default KnackSync;
