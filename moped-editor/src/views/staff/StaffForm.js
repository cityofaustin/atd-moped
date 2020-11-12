import React from "react";
import { useForm, Controller } from "react-hook-form";

import { gql, useQuery } from "@apollo/react-hooks";
import {
  Button,
  CircularProgress,
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
  email: "",
  workgroup: "",
  roles: "moped-viewer",
  status_id: 1,
};

const StaffForm = ({ editFormData = null }) => {
  const classes = useStyles();

  const { register, handleSubmit, watch, errors, control } = useForm({
    defaultValues: editFormData || initialFormValues,
  });
  const onSubmit = data => console.log(data);

  const {
    loading: workgroupLoading,
    error: workgroupError,
    data: workgroups,
  } = useQuery(WORKGROUPS_QUERY);

  // Fields needed
  // title
  // workgroup_id
  // password

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <FormControl variant="outlined" className={classes.formSelect}>
            <InputLabel id="workgroup-label">Workgroup</InputLabel>
            <Controller
              as={
                <Select
                  id="workgroup"
                  labelId="workgroup-label"
                  label="Workgroup"
                >
                  {!workgroupLoading &&
                    workgroups.moped_workgroup.map(workgroup => (
                      <MenuItem
                        key={workgroup.workgroup_id}
                        value={workgroup.workgroup_id}
                      >
                        {workgroup.workgroup_name}
                      </MenuItem>
                    ))}
                </Select>
              }
              name={"workgroup"}
              control={control}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <FormControl component="fieldset">
            <FormLabel id="statuses-label">Status</FormLabel>
            <Controller
              as={
                <RadioGroup aria-label="statuses" name="status_id">
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
