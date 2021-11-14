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

  const handleSync = () => {
    console.log(project.moped_project[0]);
    //const method = getHttpMethod();
    fetch(buildUrl(), {
      method: getHttpMethod(),
      })
      .then(response => response)
      .then( 
        result => {
          console.log(result);
        },
        error => {
          console.log(error);
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