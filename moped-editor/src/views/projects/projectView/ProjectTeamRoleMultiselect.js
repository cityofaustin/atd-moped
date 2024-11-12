import React from "react";
import { FormControl, FormHelperText } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

const ProjectTeamRoleMultiselect = ({ value, onChange, roles }) => {
  return (
    <FormControl variant="standard" style={{ width: "100%" }}>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value)}
        renderValue={(selected) =>
          selected
            .map(
              (roleId) =>
                roles.find((role) => role.project_role_id === roleId)
                  ?.project_role_name
            )
            .join(", ")
        }
      >
        {roles.map((role) => (
          <MenuItem key={role.project_role_id} value={role.project_role_id}>
            <Checkbox checked={value.includes(role.project_role_id)} />
            <ListItemText primary={role.project_role_name} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Required</FormHelperText>
    </FormControl>
  );
};

export default ProjectTeamRoleMultiselect; 