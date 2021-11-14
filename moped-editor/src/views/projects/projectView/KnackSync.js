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
      'Content-Type': 'application/json/',
      'X-Knack-Application-Id': knackApplicationId,
      'X-Knack-REST-API-Key': 'knack',
    };
    return headers;
  }

  const handleSync = () => {
    console.log(project.moped_project[0]);
    //const method = getHttpMethod();
    fetch(buildUrl(), {
      method: getHttpMethod(),
      headers: buildHeaders(),
      })
      .then(response => response.json())
      .then( 
        result => {
          console.log('success:', result);
          
        },
        error => {
          console.log('error:', error);
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