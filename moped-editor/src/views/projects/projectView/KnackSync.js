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
    scene_number = 514, 
    view_number = 3047 
    }) {

  const buildUrl = () => {
    let url = 'https://api.knack.com/v1/pages/scene_' + scene_number + '/views/view_' + view_number + '/records';
    if (project.moped_project[0].knack_project_id) { // existing record
      url = url + '/' + project.moped_project[0].knack_project_id;
    }
    return url;
  }

  const handleSync = () => {
    console.log(project.moped_project[0]);
    buildUrl();
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