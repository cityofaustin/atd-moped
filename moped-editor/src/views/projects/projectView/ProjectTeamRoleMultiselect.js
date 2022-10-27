import React from "react";

import {
  Checkbox,
  FormControl,
  FormHelperText,
  Input,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
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
          return selectedRoles.map(({ project_role_name }) => (
            <Typography key={project_role_name}>{project_role_name}</Typography>
          ));
        }}
        /*  
            There appears to be a problem with MenuProps in version 4.x (which is fixed in 5.0),
            this is fixed by overriding the function "getContentAnchorEl".
                Source: https://github.com/mui-org/material-ui/issues/19245#issuecomment-620488016
        */
        MenuProps={{
          getContentAnchorEl: null,
          style: {
            maxHeight: 500,
          },
          PaperProps: { style: { width: "50%" } },
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
          transformOrigin: { vertical: "top", horizontal: "center" },
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
              // ListItemClasses
              <MenuItem key={project_role_id} value={project_role_id}>
                <Checkbox checked={isChecked} color={"primary"} />
                <ListItemText
                  primary={<span>{project_role_name}</span>}
                  secondary={
                    <span style={{ whiteSpace: "normal" }}>
                      {project_role_description}
                    </span>
                  }
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
