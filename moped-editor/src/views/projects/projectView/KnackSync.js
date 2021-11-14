import React, { useEffect } from "react";
//import { Button } from "@material-ui/core"
import {
    MenuItem,
    Icon,
    ListItemIcon,
    ListItemText,
  } from "@material-ui/core";

export default function KnackSync ({
    project, 
    closeHandler, 
    sceneNumber = 514, 
    viewNumber = 3047,
    knackApplicationId = '6167314778435d001ea3e7cb',

    }) {

  const buildUrl = () => {
    let url = 'https://api.knack.com/v1/pages/scene_' + sceneNumber + '/views/view_' + viewNumber + '/records';
    if (project.moped_project[0].knack_project_id) { // existing record
      url = url + '/' + project.moped_project[0].knack_project_id;
    }
    return url;
  }

  const getHttpMethod = () => {
    let method = 'POST';
    if (project.moped_project[0].knack_project_id) {
      method = 'PUT';
    }
    return method;
  }

  const buildHeaders = () => {
    let headers = {
      'Content-Type': 'application/json',
      'X-Knack-Application-Id': knackApplicationId,
      'X-Knack-REST-API-Key': 'knack',
    };
    return headers;
  }

  const buildBody = () => {
    let body = {
      field_3998: project.moped_project[0].project_id,
      field_3999: project.moped_project[0].project_name,
      field_4000: project.moped_project[0].current_status
    };
    return(JSON.stringify(body));
  }

  const handleSync = () => {
    console.log(project.moped_project[0]);
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
          } else {
          console.log('success:', result);
          }
        },
        error => {
          console.log('fetch error:', error);
        }
      );
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

};