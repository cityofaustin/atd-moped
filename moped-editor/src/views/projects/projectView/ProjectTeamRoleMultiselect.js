import React, { useEffect, useState } from "react";

import {
  Checkbox,
  FormControl,
  Input,
  ListItemText,
  MenuItem,
  Select,
} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ProjectTeamRoleMultiselect = ({
  roles,
  roleDescriptions,
  initialValue,
  value,
  onChange,
}) => {
  const classes = useStyles();
  const [userRoles, setUserRoles] = useState(
    initialValue ? initialValue.map(v => Number.parseInt(v)) : []
  );

  const handleChange = event => {
    setUserRoles(event.target.value);
  };

  useEffect(() => {
    onChange(userRoles);
    // Unfortunately, adding onChange breaks useEffect
    // eslint-disable-next-line
  }, [userRoles, value]);

  return (
    <FormControl className={classes.formControl}>
      <Select
        labelId="team-role-multiselect-label"
        id="team-role-multiselect"
        multiple
        value={userRoles}
        onChange={handleChange}
        input={<Input id="select-multiple" />}
        renderValue={selected => selected.map(value => roles[value]).join(", ")}
        MenuProps={MenuProps}
      >
        {Object.keys(roles).map(roleId => (
          <MenuItem key={roleId} value={Number.parseInt(roleId)}>
            <Checkbox
              checked={userRoles.includes(Number.parseInt(roleId))}
              color={"primary"}
            />
            <ListItemText primary={roles[roleId]} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ProjectTeamRoleMultiselect;
