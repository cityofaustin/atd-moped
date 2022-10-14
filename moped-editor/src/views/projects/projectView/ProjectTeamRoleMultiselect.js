import React, { useEffect, useState } from "react";

import {
  Checkbox,
  FormControl,
  FormHelperText,
  Input,
  ListItemText,
  MenuItem,
  Select,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  infoIcon: {
    color: theme.palette.action.disabled,
  },
}));

const ProjectTeamRoleMultiselect = ({ roles, value, onChange }) => {
  const classes = useStyles();
  return (
    <FormControl className={classes.formControl}>
      <Select
        style={{ minWidth: "8em" }}
        labelId="team-role-multiselect-label"
        id="team-role-multiselect"
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value)}
        input={<Input id="select-multiple" />}
        renderValue={() => {
          const selectedRoles = roles.filter((role) =>
            value.includes(role.project_role_id)
          );
          const roleNames = selectedRoles.map(
            ({ project_role_name }) => project_role_name
          );
          return roleNames.join(", ");
        }}
        /*  
            There appears to be a problem with MenuProps in version 4.x (which is fixed in 5.0),
            this is fixed by overriding the function "getContentAnchorEl".
                Source: https://github.com/mui-org/material-ui/issues/19245#issuecomment-620488016
        */
        MenuProps={{
          getContentAnchorEl: () => null,
          style: {
            maxHeight: 400,
            width: 450,
          },
        }}
      >
        {roles.map(
          ({
            project_role_id,
            project_role_name,
            project_role_description,
          }) => {
            const isChecked = value.includes(project_role_id);
            return (
              <MenuItem key={project_role_id} value={project_role_id}>
                <Checkbox checked={isChecked} color={"primary"} />
                <ListItemText
                  primary={project_role_name}
                  secondary={project_role_description}
                />
              </MenuItem>
            );
          }
        )}
      </Select>
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};

export default ProjectTeamRoleMultiselect;
