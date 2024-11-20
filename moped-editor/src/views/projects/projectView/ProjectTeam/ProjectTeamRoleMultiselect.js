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
import { useGridApiContext } from "@mui/x-data-grid-pro";


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




const ProjectTeamRoleMultiselect = ({ id, field, roles, value }) => {
  const rolesArray = value.map((role) => role.project_role_id);
  const [selectedValues, setSelectedValues] = React.useState(rolesArray || []);

  const classes = useStyles();
  const apiRef = useGridApiContext();
  const ref = React.useRef(null);

  const handleChange = (event) => {
    const valueIds = event.target.value;
    const newValue = roles.filter((role) => valueIds.includes(role.project_role_id));
    const rolesArray = newValue.map((role) => role.project_role_id);
    setSelectedValues(rolesArray);
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });
  };

  return (
    <FormControl variant="standard" className={classes.formControl}>
      <Select
        variant="standard"
        style={{ minWidth: "8em" }}
        labelId="team-role-multiselect-label"
        id={String(id)}
        multiple
        value={selectedValues}
        onChange={handleChange}
        input={<Input id="select-multiple" />}
        renderValue={() => {
          const selectedRoles = roles.filter((role) =>
            selectedValues.includes(role.project_role_id)
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
            const isChecked = selectedValues.includes(project_role_id);
            return (
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
