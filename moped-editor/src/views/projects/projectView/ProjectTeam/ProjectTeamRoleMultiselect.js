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
import { useGridApiContext } from "@mui/x-data-grid-pro";
import theme from "src/theme";

/**
 * @param {Integer} id - Data Grid row id (same as record id)
 * @param {String} value - field value
 * @param {String} field - name of field
 * @param {[Object]} roles - array of role objects: {project_role_id, project_role_name, project_role_description}
 * @param {Boolean} hasFocus - does this field have focus
 * @param {Boolean} error - toggles error style in textfield
 * @return {JSX.Element}
 */
const ProjectTeamRoleMultiselect = ({
  id,
  field,
  roles,
  value,
  error,
  hasFocus,
}) => {
  const ref = React.useRef(null);
  const rolesArray = React.useMemo(
    () => value.map((role) => role.project_role_id),
    [value]
  );
  const [selectedValues, setSelectedValues] = React.useState(rolesArray || []);

  React.useEffect(() => {
    if (hasFocus) {
      ref.current.focus();
    }
  }, [hasFocus]);

  const apiRef = useGridApiContext();

  const handleChange = (event) => {
    const valueIds = event.target.value;
    const newValue = roles.filter((role) =>
      valueIds.includes(role.project_role_id)
    );
    const rolesArray = newValue.map((role) => role.project_role_id);
    setSelectedValues(rolesArray);
    apiRef.current.setEditCellValue({
      id,
      field,
      value: newValue,
    });
  };

  return (
    <FormControl variant="standard" sx={{ margin: theme.spacing(1) }}>
      <Select
        variant="standard"
        sx={{ minWidth: theme.spacing(10) }}
        labelId="team-role-multiselect-label"
        id={String(id)}
        multiple
        error={error}
        value={selectedValues}
        onChange={handleChange}
        input={<Input id="select-multiple" inputRef={ref} />}
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
        }}
      >
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
      <FormHelperText error={error}>Required</FormHelperText>
    </FormControl>
  );
};

export default ProjectTeamRoleMultiselect;
