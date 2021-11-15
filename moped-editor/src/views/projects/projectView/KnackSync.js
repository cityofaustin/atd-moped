import React, { useState } from "react";
import {
    MenuItem,
    Icon,
    ListItemIcon,
    ListItemText,
  } from "@material-ui/core";

import { useMutation } from "@apollo/client";

import { UPDATE_PROJECT_KNACK_ID } from "../../../queries/project";

//export default function KnackSync ({
const KnackSync = React.forwardRef(({
    project, 
    closeHandler, 
    snackbarHandler,
    sceneNumber = 514, 
    viewNumber = 3047,
    knackApplicationId = '6167314778435d001ea3e7cb',
    }, ref) => {

  const buildUrl = () => {
    let url = 'https://api.knack.com/v1/pages/scene_' + sceneNumber + '/views/view_' + viewNumber + '/records';
    if (project.moped_project[0].knack_project_id) { // existing record
      url = url + '/' + project.moped_project[0].knack_project_id;
    }
    return url;
  };

  const getHttpMethod = () => {
    let method = 'POST';
    if (project.moped_project[0].knack_project_id) {
      method = 'PUT';
    }
    return method;
  };

  const buildHeaders = () => {
    let headers = {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': knackApplicationId,
      'X-Knack-REST-API-Key': 'knack',
    };
    return headers;
  };

  const buildBody = () => {

    // FIXME the project.moped_project[0] doesn't get updated if the user uses the UI to 
    // change data, in the eyes of this component. 
    // 
    // is that because it doesn't get updated in the parent components, or does this hold a 
    // copy that isn't a reference to the parent's data
    //console.log('buildBody current state: ', project.moped_project[0].currentKnackState)
    //console.log('buildBody project state', project.moped_project[0])

    let body = { };

    let field_map = {
      field_3998: 'project_id',
      field_3999: 'project_name',
      field_4000: 'current_status',
    };

    Object.keys(field_map).forEach(element => {
      if (project.moped_project[0].currentKnackState[element] !== project.moped_project[0][field_map[element]]) {
        body[element] = project.moped_project[0][field_map[element]];
      }
    });

    return(JSON.stringify(body));
  };

  const [mutateProjectKnackId, { data, loading, error }] = useMutation(UPDATE_PROJECT_KNACK_ID);

  const handleSync = () => {
    //project.moped_project[0].knack_project_id = '61914151b08f28001e8b87d8';
    if (project.moped_project[0].knack_project_id) { // updating knack record
      console.log('updating record');
      fetch(buildUrl(), {
        method: 'GET',
        headers: buildHeaders(),
        })
        .then(response => response.json())
        .then( 
          result => {
            if (result.errors) { // knack error
              console.log('get-state knack error:', result);
              return Promise.reject(result);
            } else {
              console.log('get-state success:', result);
              project.moped_project[0].currentKnackState = result;
              return fetch(buildUrl(), {
                method: getHttpMethod(),
                headers: buildHeaders(),
                body: buildBody(),
                });
            }
          },
          error => {
            console.log('get-state fetch error:', error);
            return Promise.reject(error);
          })
        .then(response => response.json())
        .then( 
          result => {
            if (result.errors) { // knack error
              console.log('knack error:', result);
            } else {
              console.log('update success:', result);
              snackbarHandler({
                seveirty: 'successs',
                message: 'Success: Project data pushed to Data Tracker'
              });
            }
          },
          error => {
            console.log('fetch error:', error);
          }
        );
    } else { // creating new knack record
      console.log('creating record');
      project.moped_project[0].currentKnackState = {};
      fetch(buildUrl(), {
        method: getHttpMethod(),
        headers: buildHeaders(),
        body: buildBody(),
        })
      .then(response => response.json())
      .then( 
        result => {
          if (result.errors) { // knack error
            console.log('knack error:', result);
            return Promise.reject(result);
          } else {
            console.log('success:', result);
            return Promise.resolve(result);
          }
        },
        error => {
          console.log('fetch error:', error);
          return Promise.reject(error);
        })
      .then(knack_record => {
        console.log('knack record: ', knack_record);
        mutateProjectKnackId({ variables: {
          project_id: project.moped_project[0].project_id,
          knack_id: knack_record.record.id,
          }
        });
      });
    }
    
    closeHandler();
  };

  return (
    <MenuItem onClick={handleSync} selected={false}>
      <ListItemIcon>
        <Icon fontSize="small">cached</Icon>
      </ListItemIcon>
      <ListItemText primary="Sync to Knack" />
    </MenuItem>
  );

});

export default KnackSync;