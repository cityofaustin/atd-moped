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
     * Function to hanlde the actual mechanics of syncronizing the data on hand to the Knack API endpoint.
     */
    const handleSync = () => {
      if (project.knack_project_id) {
        // updating knack record
        fetch(knackEndpointUrl, {
          method: "GET",
          headers: buildHeaders,
        })
          .then(response => response.json())
          .then(
            result => {
              if (result.errors) {
                // knack error
                snackbarHandler({
                  severity: "warning",
                  message: "Error: Data Tracker sync failed.",
                });
                return Promise.reject(result);
              } else {
                // get-state success
                project.currentKnackState = result;
                return fetch(knackEndpointUrl, {
                  method: knackHttpMethod,
                  headers: buildHeaders,
                  body: buildBody(),
                });
              }
            },
            error => {
              // get-state fetch error
              snackbarHandler({
                severity: "warning",
                message: "Error: Data Tracker sync failed.",
              });
              return Promise.reject(error);
            }
          )
          .then(response => response.json())
          .then(
            result => {
              if (result.errors) {
                // knack error
                snackbarHandler({
                  severity: "warning",
                  message: "Error: Data Tracker sync failed.",
                });
              } else {
                // successful update
                snackbarHandler({
                  severity: "success",
                  message: "Success: Project data pushed to Data Tracker.",
                });
              }
            },
            error => {
              // fetch error
              snackbarHandler({
                severity: "warning",
                message: "Error: Data Tracker sync failed.",
              });
            }
          )
          .then(refetch);
      } else {
        // creating new knack record
        project.currentKnackState = {};
        fetch(knackEndpointUrl, {
          method: knackHttpMethod,
          headers: buildHeaders,
          body: buildBody(),
        })
          .then(response => response.json())
          .then(
            result => {
              if (result.errors) {
                // knack error
                snackbarHandler({
                  severity: "warning",
                  message: "Error: Data Tracker sync failed.",
                });
                return Promise.reject(result);
              } else {
                // knack fetch success
                return Promise.resolve(result);
              }
            },
            error => {
              // fetch error
              snackbarHandler({
                severity: "warning",
                message: "Error: Data Tracker sync failed.",
              });
              return Promise.reject(error);
            }
          )
          .then(knack_record => {
            mutateProjectKnackId({
              variables: {
                project_id: project.project_id,
                knack_id: knack_record.record.id,
              },
            });
            snackbarHandler({
              severity: "success",
              message: "Success: Project data pushed to Data Tracker.",
            });
          })
          .then(refetch);
      }

      closeHandler();
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
