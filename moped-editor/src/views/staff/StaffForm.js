import React from "react";
import { useForm, Controller } from "react-hook-form";

import { gql, useQuery } from "@apollo/react-hooks";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  TextField,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@material-ui/core";

const WORKGROUPS_QUERY = gql`
  query GetWorkgroups {
    moped_workgroup {
      workgroup_id
      workgroup_name
    }
  }
`;

const roles = [
  { value: "moped-viewer", name: "Viewer" },
  { value: "moped-editor", name: "Editor" },
  { value: "moped-admin", name: "Admin" },
];

const statuses = [
  { value: "1", name: "Active" },
  { value: "0", name: "Inactive" },
];

const useStyles = makeStyles(() => ({
  formSelect: {
    minWidth: 195,
  },
}));

const initialFormValues = {
  first_name: "",
  last_name: "",
  password: "",
  email: "",
  workgroup: "",
  workgroup_id: "",
  roles: "moped-viewer",
  status_id: "1",
};

const parsers = {
  status_id: id => parseInt(id),
};

const StaffForm = ({ editFormData = null }) => {
  const classes = useStyles();

  const { register, handleSubmit, watch, errors, control, setValue } = useForm({
    defaultValues: editFormData || initialFormValues,
  });

  const onSubmit = data => {
    console.log(data);
  };

  const {
    loading: workgroupLoading,
    error: workgroupError,
    data: workgroups,
  } = useQuery(WORKGROUPS_QUERY);

  const updateWorkgroupFields = e => {
    const workgroupId = e.nativeEvent.target.dataset.id;
    const workgroupName = e.target.value;

    // When workgroup field updates, set corresponding workgroup_id value
    setValue("workgroup_id", workgroupId);

    // React Hook Form expects the custom onChange action to return workgroup field value
    return workgroupName;
  };

  // Fields needed
  // TODO: Update status_id to int before request
  // TODO: Validate password with same regex as API

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} lg={3}>
          <TextField
            name="first_name"
            id="first-name"
            label="First Name"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TextField
            name="last_name"
            id="last-name"
            label="Last Name"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TextField
            name="email"
            id="email"
            label="Email"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <TextField
            name="password"
            id="password"
            label="Password"
            type="password"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            inputRef={register}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControl variant="outlined" className={classes.formSelect}>
            <InputLabel id="workgroup-label">Workgroup</InputLabel>
            <Controller
              as={({ onChange }) => (
                <Select
                  id="workgroup"
                  labelId="workgroup-label"
                  label="Workgroup"
                  onChange={e => onChange(updateWorkgroupFields(e))}
                >
                  {!workgroupLoading &&
                    workgroups.moped_workgroup.map(workgroup => (
                      <MenuItem
                        key={workgroup.workgroup_id}
                        value={workgroup.workgroup_name}
                        data-id={workgroup.workgroup_id}
                      >
                        {workgroup.workgroup_name}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name={"workgroup"}
              control={control}
            />
          </FormControl>
        </Grid>
        <TextField
          id="workgroup-id"
          name="workgroup_id"
          inputRef={register}
          type="hidden"
        />
        <Grid item xs={12} sm={6} lg={3}>
          <FormControl component="fieldset">
            <FormLabel id="roles-label">Role</FormLabel>
            <Controller
              as={
                <RadioGroup aria-label="roles" name="roles">
                  {roles.map(role => (
                    <FormControlLabel
                      key={role.value}
                      value={role.value}
                      control={<Radio />}
                      label={role.name}
                    />
                  ))}
                </RadioGroup>
              }
              name={"roles"}
              control={control}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControl component="fieldset">
            <FormLabel id="statuses-label">Status</FormLabel>
            <Controller
              as={
                <RadioGroup
                  aria-label="statuses"
                  name="status_id"
                  // Parse value as int type as expected by the User Management API
                  // onChange={e => onChange(parseInt(e.target.value))}
                >
                  {statuses.map(status => (
                    <FormControlLabel
                      key={status.value}
                      value={status.value}
                      control={<Radio />}
                      label={status.name}
                    />
                  ))}
                </RadioGroup>
              }
              name={"status_id"}
              control={control}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default StaffForm;
