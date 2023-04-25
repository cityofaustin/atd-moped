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
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

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
    <FormControl variant="standard" className={classes.formControl}>
      <Select
        variant="standard"
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
        MenuProps={{
          style: {
            maxHeight: 500,
          },
          PaperProps: { style: { width: "50%" } },
          anchorOrigin: { vertical: "bottom", horizontal: "center" },
          transformOrigin: { vertical: "top", horizontal: "center" },
        }}>
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
